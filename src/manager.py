import logging

import fasttext
from utils import downloader
import hashlib
import base58
import json

from sentence_transformers import SentenceTransformer

import os

# define constants
MODEL_FASTTEXT = "ftxt"
MODEL_S_TRANSFORMER = "strn"

# Maintain a model directory
data_dir = os.environ["DATA_STORE_LOCATION"]
model_dir = data_dir + "models/"
model_dict = {}
hash_dict = None

def write_json_file (file, data):
    with open(file, 'w') as outfile:
        json.dump(data, outfile)

def read_json_file (file):
    with open(file) as json_file:
        return json.load(json_file)

def get_url (schema):
    """
    Get model url from a schema
    """
    
    if schema.get("encoder") != None:
        return schema["encoder"]
    else:
        return None

def get_url_hash (url):
    hash_ = hashlib.sha256(url.encode('utf-8'))
    b58c_ = base58.b58encode(hash_.digest())
    return b58c_.decode('utf-8')

def download_model (url, directory, file_name):
    """
    Download a model from a URL
    """

    # handle fasttext models from url or IPFS
    if url.split(":")[0] == MODEL_FASTTEXT:
        url = ":".join(url.split(":")[1:])
        
        if url.split(":")[0] == "http" or url.split(":")[0] == "https":
            return MODEL_FASTTEXT, downloader.http_download(url, directory, file_name)

        elif url.split(":")[0] == "ipfs":
            return MODEL_FASTTEXT, downloader.ipfs_download(url, directory, file_name)
    elif url.split(":")[0] == MODEL_S_TRANSFORMER:
        url = ":".join(url.split(":")[1:])
        return MODEL_S_TRANSFORMER, url
    else:
        logging.error("Invalid encoder specified in schema definition.")
        return None, ""

def memload_model (model_type, model_filename):
    """
    Load a model from disk
    """

    if model_type == MODEL_FASTTEXT:
        if model_filename:
            logging.debug("loading fasttext model into memory..")
            return model_type, fasttext.load_model(model_filename)
        else:
            return None, None
    elif model_type == MODEL_S_TRANSFORMER:
        if model_filename:
            logging.debug("loading STransformer model into memory..")
            return model_type, SentenceTransformer(model_filename)
        else:
            return None, None
    else:
        return None, None

def preload_model (database_name, json_schema):
    """
    Download a model and load it into memory
    """

    # prefill model & hash dictionary
    global hash_dict
    if hash_dict == None:
        try:
            hash_dict = read_json_file(data_dir + 'hub_hash_dict.json')
        except Exception as e:
            logging.error("model & hash dict json read error")
            logging.error(e)
            hash_dict = {}
    
    try:
        # keep reference to model hash from database (DB - hash map)
        if not hash_dict.get(database_name):
            hash_dict[database_name] = get_url_hash(get_url(json_schema))

        # keep reference to model memory from hash (hash - mem model map)
        if not model_dict.get(hash_dict[database_name]):
            model_dict[hash_dict[database_name]] = {}
            model_dict[hash_dict[database_name]]["type"], model_dict[hash_dict[database_name]]["model"] = memload_model(*download_model(get_url(json_schema), model_dir, database_name))
            
            if model_dict[hash_dict[database_name]]["model"]:
                logging.debug("Model loaded for database: "+database_name)
                return True
            else:
                logging.error("Model loading failed for database: "+database_name)
                # reser DB - hash map
                hash_dict[database_name] = None
                return False
        
        # persist to disk
        try:
            write_json_file(data_dir + 'hub_hash_dict.json', hash_dict)
            return True
        except Exception as e:
            logging.error("model & hash dict json write error")
            logging.error(e)
            return False

    except Exception as e:
        logging.error(e)
        return False

def compress_data (database_name, texts):
    """
    Load an already existing database 
    """

    # prefill model & hash dictionary
    global hash_dict
    if hash_dict == None:
        try:
            hash_dict = read_json_file(data_dir + 'hub_hash_dict.json')
        except Exception as e:
            logging.error("model & hash dict json read error")
            logging.error(e)
            hash_dict = {}

    if not hash_dict.get(database_name):
        logging.error("Model not pre-loaded for database: "+database_name)
        return []
    if not model_dict.get(hash_dict[database_name]):
        # try dynamic loading of model
        try:
            model_dict[hash_dict[database_name]] = {}
            model_dict[hash_dict[database_name]]["type"], model_dict[hash_dict[database_name]]["model"] = memload_model(MODEL_FASTTEXT, model_dir + database_name + ".bin")
        except Exception as e:
            logging.error("Model not mem-loaded for database: "+database_name)
            logging.error(e)
            return []
    
    result = []
    try:
        for text in texts:
            # fasttext model prediction
            if model_dict[hash_dict[database_name]]["type"] == MODEL_FASTTEXT:
                result.append(model_dict[hash_dict[database_name]]["model"].get_sentence_vector(text).tolist())
            # stransformer model prediction
            if model_dict[hash_dict[database_name]]["type"] == MODEL_S_TRANSFORMER:
                result.append(model_dict[hash_dict[database_name]]["model"].encode(text).tolist())

        return result
    except Exception as e:
        logging.error(e)
        logging.error("Model prediction error for database: "+database_name)
        return []
