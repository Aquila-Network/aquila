import logging

from quart import Quart
from quart import request

from functools import wraps
import asyncio

from utils import config
import authentication
import manager as man_

app = Quart(__name__, instance_relative_config=True)

# Server starter
def quartserver ():
    """
    start server
    """
    app.run(host='0.0.0.0', port=5002, debug=False)

# Add authentication
def authenticate ():
    def decorator (f):
        @wraps(f)
        async def wrapper (*args, **kwargs):
            params = await extract_request_params(request)

            if not params or not "data" in params or not "signature" in params:
                return "Unauthorised access", 401

            if not authentication.check(params["data"], params["signature"]):
                return "Unauthorised access", 401

            return await f(*args, **kwargs)

        return wrapper
    return decorator

async def extract_request_params (request):
    if not request.is_json:
        logging.error("Cannot parse request parameters")

        # request is invalid
        return {}

    # Extract JSON data
    data_ = await request.get_json()

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
async def prepare_model ():
    """
    Preload and prepare model from schema definition
    """

    # get parameters
    params = (await extract_request_params(request)).get("data")

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "schema" in params:
        database_name = app.manager.preload_model(params.get("schema"))

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
async def compress_data ():
    """
    generate embeddings for an input data
    """

    # get parameters
    params = (await extract_request_params(request)).get("data")

    if not params:
        # Build error response
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

    if "text" in params and "databaseName" in params:
        vectors = await app.manager.compress_data(params.get("databaseName"), params.get("text"))

        # Build response
        if vectors:
            return {
                    "success": True,
                    "vectors": vectors
                }, 200
        else:
            return {
                    "success": False,
                    "message": "Database not found"
                }, 400
    else:
        return {
                "success": False,
                "message": "Invalid parameters"
            }, 400

@app.before_serving
async def init_variables():
    app.manager = man_.Manager()
    # prepare HUB from backup
    try:
        app.manager.prepare_hub()
    except Exception as e:
        logging.error("Backup restore failed")
        logging.error(e)
    # initialize background task controller
    app.manager.bg_task_active = True

@app.before_serving
async def init_tasks():
    # initialize background task
    app.manager.background_task = asyncio.ensure_future(app.manager.background_task())
    # app.add_background_task(background_task)

@app.after_serving
async def shutdown():
    # shutdown background task
    app.manager.bg_task_active = False
    app.manager.background_task.cancel()

if __name__ == "__main__":
    quartserver()