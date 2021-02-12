import logging
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)

import manager

import os
import json

from utils import CID, schema

STORE_LOCATION = os.environ["DATA_STORE_LOCATION"]

# databases dictionary
databases = {}

def preload_databases ():
    """
    Load available databases from disk
    """
    # list database names
    for content_ in os.listdir(STORE_LOCATION):
        # simple validation for database name (CID lenngth)
        if len(content_) >= 43: # TODO: 43 check is a bad method, replace it soon
            database_name = content_

            with open(STORE_LOCATION + database_name + "/schema.json") as ischema:
                json_schema = json.load(ischema)

            manager_h = manager.VecManager(json_schema)

            # load and create databases dict
            validator_fn = schema.compile(json_schema)
            databases[database_name] = {
                "manager_h": manager_h,
                "schema": {
                    "json": json_schema,
                    "validator": validator_fn
                }
            }

    logging.debug("Loaded all existing databases")

def create_database (json_schema):
    """
    Create a database from a given valid JSON schema
    """
    # TBD: write ahead logging (INIT)

    # generate proper schema definition from templete schema
    json_schema = schema.generate_schema(json_schema)

    # identify invalid schema template
    if json_schema == None:
        return None

    # Check if database already exists
    database_name = CID.doc2CID(json_schema)
    if databases.get(database_name):
        # return database name
        logging.debug("Database already exists")
        return database_name

    # If database doesn't exist already,
    # then create one
    manager_h = manager.VecManager(json_schema)

    database_name = manager_h.database_name

    validator_fn = schema.compile(json_schema)
    databases[database_name] = {
        "manager_h": manager_h,
        "schema": {
            "json": json_schema,
            "validator": validator_fn
        }
    }

    # TBD: save schema to storage
    # TBD: write ahead logging (END)

    return database_name

def load_database (database_name):
    """
    Load an already existing database 
    """

    return databases.get(database_name)

def insert_docs (docs, database_name):
    """
    Insert a set of valid documents to database
    """

    # write ahead log (INIT)

    cids_ = []
    docs_ = []

    # get manager_h for database_name
    database_h = load_database(database_name)
    # invalid database name
    if not database_h:
        logging.debug("Database doesn't exist. Please create one.")
        return cids_

    # validate docs against schema
    # and add CID
    
    for doc_ in docs:
        if schema.validate_json_docs(database_h["schema"]["validator"], doc_):
            CID_ = CID.doc2CID(doc_)
            cids_.append(CID_)
            doc_["CID"] = CID_
            docs_.append(doc_)
        else:
            cids_.append(None)
            
    # get manager_h for database_name
    manager_h = database_h["manager_h"]

    manager_h.add_vectors(docs_)

    # write ahead log (END)

    return cids_

def delete_docs (ids, database_name):

    # write ahead log (INIT)

    # get manager_h for database_name
    database_h = load_database(database_name)
    # invalid database name
    if not database_h:
        logging.debug("Database doesn't exist. Please create one.")
        return []

    return database_h["manager_h"].delete_vectors(ids)

def search (matrix, k, rad, database_name):

    # write ahead log (INIT)

    # get manager_h for database_name
    database_h = load_database(database_name)

    return database_h["manager_h"].get_nearest(matrix, k, rad)
