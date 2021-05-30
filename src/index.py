import logging

from flask import Flask, request
from flask_cors import CORS
from flask import jsonify
from functools import wraps

import html_cleanup as chtml

from services import logging as slog
slogging_session = slog.create_session(["127.0.0.1"])

import math

from aquilapy import Wallet, DB, Hub
from bs4 import BeautifulSoup

from transformers import pipeline
summarizer = None # pipeline("summarization")
qa = None # pipeline("question-answering")
def init_augmentation ():
    global summarizer
    global qa
    summarizer = pipeline("summarization")
    qa = pipeline("question-answering")
    return True


app = Flask(__name__, instance_relative_config=True)

# Create a wallet instance from private key
wallet = Wallet("/ossl/private_unencrypted.pem")

# Connect to Aquila DB instance
db = DB("http://aquiladb", "5001", wallet)

# Connect to Aquila Hub instance
hub = Hub("http://aquilahub", "5002", wallet)

def create_database (user_id):

    # Schema definition to be used
    schema_def = {
        "description": "Wikipedia",
        "unique": user_id,
        "encoder": "ftxt:https://ftxt-models.s3.us-east-2.amazonaws.com/cc.en.300.bin",
        "codelen": 300,
        "metadata": {
            "url": "string",
            "text": "string"
        }
    }


    # Craete a database with the schema definition provided
    db_name = db.create_database(schema_def)

    # Craete a database with the schema definition provided
    db_name_ = hub.create_database(schema_def)

    return db_name, True

# Compress data
def compress_strings (db_name, strings_in):
    return hub.compress_documents(db_name, strings_in)

# Insert docs
def index_website (db_name, paragraphs, title, url):
    # add title as well
    if title != "":
        paragraphs = paragraphs.append(title)

    compressed = compress_strings(db_name, paragraphs)
    docs = []
    for idx_, para in enumerate(paragraphs):
        docs.append({
            "metadata": {
                "url": url, 
                "text": para
            },
            "code": compressed[idx_]
        })
    try:
        dids = db.insert_documents(db_name, docs)
        return True
    except Exception as e:
        logging.debug(e)
        return False

# generate summary
def summarize(text):
    if not summarizer:
        init_augmentation()
    return summarizer(text[:1024], min_length=5, max_length=20)[0]["summary_text"]

# generate QA
def QAgen(query, context):
    if not qa:
        init_augmentation()
    return qa(question=query, context=context)

# Search docs
def search_docs(db_name, query):
    compressed = compress_strings(db_name, [query])
    docs, dists = db.search_k_documents(db_name, compressed, 100)
    index = {}
    score = {}
    max_score = dists[0][-1]
    min_score = dists[0][0]

    for idx_, doc in enumerate(docs[0]):
        metadata = doc["metadata"]
        # -------------------------- exponential dampening ------------------------------
        # ------------------- normalize --------------------------
        #      ------ reposition --------
        #                                                            - 1->0 : lesser steep curve -
        # (1 - (dists[0][idx_]-min_score) / (max_score-min_score)) * math.exp(-0.06*idx_)
        if index.get(metadata["url"]):
            index[metadata["url"]] += 1
            score[metadata["url"]] += (1 - (dists[0][idx_]-min_score) / (max_score-min_score)) * math.exp(-0.06*idx_)
        else:
            index[metadata["url"]] = 1
            score[metadata["url"]] = (1 - (dists[0][idx_]-min_score) / (max_score-min_score)) * math.exp(-0.06*idx_)

    results_d = {}
    n_unique_results = len(index.keys())
    percent_share_target = 100 / n_unique_results
    for key in index:
        result_imbalance = int(index[key] / percent_share_target)
        if result_imbalance > 1:
            # big imbalances, fix later 
            pass
        results_d[key] = score[key]

    results_d = {k: v for k, v in sorted(results_d.items(), key=lambda item: item[1], reverse=True)}

    return results_d
    
    # threshold = -1
    # for key in results_d:
        # print(key, results_d[key])
    #     if threshold == -1:
    #         threshold = round(results_d[key]*0.1)
    #     if results_d[key] > threshold:
    #         print(key)

# Get paragraphs given html document
# def get_paragraphs(html_doc):
#     soup = BeautifulSoup(html_doc, 'html.parser')
#     paras = []
#     for para in soup.find_all("p"):
#         text_data = para.text
#         for txt in text_data.split("\n"):
#             if txt.strip() != "":
#                 paras.append(" ".join(txt.strip().split()))
#     return paras

# Add authentication
def authenticate ():
    def decorator (f):
        @wraps(f)
        def wrapper (*args, **kwargs):
            # skip
            return f(*args, **kwargs)

        return wrapper
    return decorator

def extract_request_params (request):
    if not request.is_json:
        logging.error("Cannot parse request parameters")

        # request is invalid
        return {}

    # Extract JSON data
    data_ = request.get_json()

    return data_

@app.route("/", methods=['GET'])
def info ():
    """
    Check server status
    """

    # Build response
    return {
            "success": True,
            "message": "Aquila X is running healthy"
        }, 200

@app.route("/create", methods=['POST'])
@authenticate()
def create_db ():
    """
    Create a database on demand given a random unique seed
    """

    # get parameters
    user_id = None
    if extract_request_params(request).get("seed"):
        user_id = extract_request_params(request)["seed"]

    if not user_id:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    db_name, status = create_database(user_id)

    # Build response
    if status:
        return {
                "success": True,
                "databaseName": db_name
            }, 200
    else:
        return {
                "success": False,
                "message": "Invalid schema definition"
            }, 400

@app.route("/index", methods=['POST'])
@authenticate()
def index_page ():
    """
    Index html page
    """

    # get parameters
    html_data = None
    url = None
    db_name = None
    if extract_request_params(request).get("database") and extract_request_params(request).get("html") and extract_request_params(request).get("url"):
        html_data = extract_request_params(request)["html"]
        url = extract_request_params(request)["url"]
        db_name = extract_request_params(request)["database"]

    if not html_data or not url or not db_name:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    # cleanup html
    chtml_data = chtml.process_html(html_data, url)
    thtml_data = chtml.trim_content(chtml_data["data"]["content"])["result"]

    # index html
    status = index_website(db_name, thtml_data, chtml_data["data"]["title"], url)

    # Build response
    if status:
        # logging
        if slogging_session != None:
            slog.put_log_index(slogging_session, db_name, url, html_data, 0)
        return {
                "success": True,
                "databaseName": db_name
            }, 200
    else:
        return {
                "success": False,
                "message": "Invalid schema definition"
            }, 400

@app.route("/search", methods=['POST'])
def search ():
    """
    Search database for matches
    """

    # get parameters
    query = None
    db_name = None
    if extract_request_params(request).get("database") and extract_request_params(request).get("query"):
        db_name = extract_request_params(request)["database"]
        query = extract_request_params(request)["query"]

    if not query or not db_name:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    urls = search_docs(db_name, query)

    # logging
    if slogging_session != None:
        if len(urls) > 0:
            slog.put_log_search(slogging_session, db_name, query, urls[0])
        else:
            slog.put_log_search(slogging_session, db_name, query, "")

    # Build response
    return {
            "success": True,
            "result": urls
        }, 200

@app.route("/augment", methods=['POST'])
def augment ():
    """
    Augment matches
    """

    # get parameters
    query = None
    context = None
    if extract_request_params(request).get("query") and extract_request_params(request).get("context"):
        query = extract_request_params(request)["query"]
        context = extract_request_params(request)["context"]

    if not query and not context:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    summary_r = summarize(context)
    ans_r = QAgen(query, context)

    # Build response
    return {
            "success": True,
            "result": {
                "summary": summary_r,
                "ans": ans_r
            }
        }, 200

@app.route("/correct", methods=['POST'])
def correct ():
    """
    Correct matches
    """

    # get parameters
    query = None
    db_name = None
    url = None
    if extract_request_params(request).get("query") and extract_request_params(request).get("database") and extract_request_params(request).get("url"):
        query = extract_request_params(request)["query"]
        db_name = extract_request_params(request)["database"]
        url = extract_request_params(request)["url"]

    if not query and not db_name and not url:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    # logging
    if slogging_session != None:
        slog.put_log_correct(slogging_session, db_name, query, url)

    # index correction
    status = index_website(db_name, [], query, url)

    # Build response
    return {
            "success": True
        }, 200


# Server starter
def flaskserver ():
    """
    start server
    """
    app.run(host='0.0.0.0', port=5003, debug=False)

# Enable CORS
CORS(app)

if __name__ == "__main__":
    # create default database
    db_name, status = create_database("default")
    logging.debug("Default DB name: " + db_name)
    if status:
        flaskserver()