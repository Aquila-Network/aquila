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

# Server starter
def flaskserver ():
    """
    start server
    """
    app.run(host='0.0.0.0', port=5002, debug=False)

server = Process(target=flaskserver)

# Enable CORS
CORS(app)

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
            "message": "AquilaHub is running healthy"
        }, 200

@app.route("/prepare", methods=['POST'])
@authenticate()
def prepare_model ():
    """
    Preload and prepare model from schema definition
    """

    # get parameters
    params = None
    if extract_request_params(request).get("data"):
        params = extract_request_params(request)["data"]

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "databaseName" in params:
        database_name = router.preload_model(params.get("schema"))

        # Build response
        if database_name:
            return {
                    "success": True,
                    "databaseName": database_name
                }, 200
        else:
            return {
                    "success": False,
                    "message": "Invalid schema definition"
                }, 400
    else:
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

@app.route("/compress", methods=['POST'])
def compress_data ():
    """
    generate embeddings for an input data
    """

    # get parameters
    params = None
    if extract_request_params(request).get("data"):
        params = extract_request_params(request)["data"]

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "text" in params and "databaseName" in params:
        vectors = router.compress_data(params.get("databaseName"), params.get("text"))

        # Build response
        return {
                "success": True,
                "vectors": vectors
            }, 200
    else:
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

if __name__ == "__main__":
    server.start()