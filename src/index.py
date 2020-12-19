import logging

from flask import Flask, request
from flask_cors import CORS
from flask import jsonify
from functools import wraps

from utils import config
import authentication

import router

import time
from multiprocessing import Process

app = Flask(__name__, instance_relative_config=True)
server = Process(target=app.run)

# Enable CORS
CORS(app)

# preload databases
router.preload_databases()

# Add authentication
def authenticate ():
    def decorator (f):
        @wraps(f)
        def wrapper (*args, **kwargs):
            params = extract_request_params(request)

            if not params or not "data" in params or not "signature" in params:
                return "Unauthorised access", 401

            if not authentication.check(params["data"], params["signature"]):
                return "Unauthorised access", 401

            return f(*args, **kwargs)

        return wrapper
    return decorator

def extract_request_params (request):
    if not request.is_json:
        logging.error("Cannot parse request parameters")

        # request is invalid
        return None

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
            "message": "AquilaDB is running healthy"
        }, 200

@app.route("/db/create", methods=['POST'])
@authenticate()
def db_create ():
    """
    Create database from schema definition
    """

    # get parameters
    params = extract_request_params(request)["data"]

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "schema" in params:
        database_name = router.create_database(params.get("schema"))

    # Build response
    if database_name:
        return {
                "success": True,
                "database_name": database_name
            }, 200
    else:
        return {
                "success": False,
                "message": "Invalid schema definition"
            }, 400

@app.route("/db/doc/insert", methods=['POST'])
@authenticate()
def doc_insert ():
    """
    insert documents
    """

    # get parameters
    params = extract_request_params(request)["data"]

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "docs" in params and "database_name" in params:
        cids = router.insert_docs(params.get("docs"), params.get("database_name"))

    # Build response
    return {
            "success": True,
            "ids": cids
        }, 200

@app.route("/db/doc/delete", methods=['POST'])
@authenticate()
def doc_delete ():
    """
    delete documents by cid
    """

    # get parameters
    params = extract_request_params(request)["data"]

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "ids" in params and "database_name" in params:
        ids = router.delete_docs(params.get("ids"), params.get("database_name"))

    # Build response
    return {
            "success": True,
            "ids": ids
        }, 200

@app.route("/db/search", methods=['GET'])
@authenticate()
def db_search ():
    """
    search documents
    """

    # get parameters
    params = extract_request_params(request)["data"]

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "matrix" in params and "k" in params and "database_name" in params:
        docs, dists = router.search(params.get("matrix"), params.get("k"), None, params.get("database_name"))

    # Build response
    return {
            "success": True,
            "docs": docs,
            "dists": dists
        }, 200


if __name__ == "__main__":
    server.start()
    # time.sleep(5)
    # server.terminate()
    # server.join()