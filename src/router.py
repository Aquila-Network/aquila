import logging
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)

import os
import json

from utils import CID, schema
import manager

def get_database_name (schema):
    """
    Get databse name from schema
    """

    database_name = None
    try:
        schema_def = schema.generate_schema(schema)
        database_name = CID.doc2CID(schema_def)
    except Exception as e:
        logging.error(e)

    return database_name

def preload_model (json_schema):
    """
    Download a model and load it into memory
    """

    database_name = get_database_name(json_schema)
    if database_name:
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
