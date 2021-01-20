import logging

import fasttext
from utils import downloader

import os

# Maintain a model directory
data_dir = os.environ["DATA_STORE_LOCATION"]
model_dir = data_dir + "models/"
model_dict = {}

def get_url (schema):
    """
    Get model url from a schema
    """
    
    if schema.get("encoder") != None:
        return schema["encoder"]
    else:
        return None

def download_model (url, directory, file_name):
    """
    Download a model from a URL
    """

    # cleanup url - get rid of `ftxt:` in the beginning
    if url.split(":")[0] == "ftxt":
        url = ":".join(url.split(":")[1:])
    
        if url.split(":")[0] == "http" or url.split(":")[0] == "https":
            return downloader.http_download(url, directory, file_name)

        elif url.split(":")[0] == "ipfs":
            return downloader.ipfs_download(url, directory, file_name)
    else:
        logging.error("Invalid encoder URL. Follow this format 'ftxt:<http | ipfs>://<LOCATION | IPFS CID>' ")
        return None

def memload_model (model_filename):
    """
    Load a model from disk
    """

    if model_filename:
        logging.debug("loading model into memory..")
        return fasttext.load_model(model_filename)
    else:
        return None

def preload_model (database_name, json_schema):
    """
    Download a model and load it into memory
    """
    
    try:
        if model_dict.get(database_name):
            del model_dict[database_name]
        model_dict[database_name] = memload_model(download_model(get_url(json_schema), model_dir, database_name))
        if model_dict[database_name]:
            logging.debug("Model loaded for database: "+database_name)
            return True
        else:
            logging.error("Model loading failed for database: "+database_name)
            return False
    except Exception as e:
        logging.error(e)
        return False

def compress_data (database_name, texts):
    """
    Load an already existing database 
    """

    if not model_dict.get(database_name):
        try:
            model_dict[database_name] = memload_model(model_dir+database_name+".bin")
            logging.debug("Model loaded for database: "+database_name)
        except Exception as e:
            logging.error(e)
            return []
    if model_dict.get(database_name):
        result = []
        for text in texts:
            result.append(model_dict[database_name].get_sentence_vector(text).tolist())

        return result
    else:
        return []
