import logging
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)

import os
import json

from utils import CID
import manager

def validate_schema (database_name, schema):
    """
    Validate a schema
    """

    logging.debug("validating schema for database: "+CID.doc2CID(schema))
    if database_name == CID.doc2CID(schema):
        logging.debug("schema validation success")
        return True
    else:
        logging.debug("schema validation failed")
        return False

def preload_model (database_name, json_schema):
    """
    Download a model and load it into memory
    """

    if validate_schema(database_name, json_schema):
        if manager.preload_model(database_name, json_schema):
            return database_name
        else:
            return None
    else:
        return None

def compress_data (database_name, texts):
    """
    Load an already existing database 
    """

    return manager.compress_data(database_name, texts)
