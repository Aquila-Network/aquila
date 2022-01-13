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

class EncodeRequest ():
    def __init__(self, id_in, text_in):
        self.id = id_in
        self.text = text_in

class Encoder ():
    def __init__(self, database_name_in, request_queue_in):
        self.database_name = database_name_in
        # to handle requests
        self.request_queue = request_queue_in
        self.request_id_counter = 0
        self.request_id_counter_max = 10000
        # to handle responses
        self.response_queue = [None] * self.request_id_counter_max

    def __del__(self):
        logging.debug("killed encoder for database")

    def count_request_id (self):
        ret_ = self.request_id_counter
        self.request_id_counter = (self.request_id_counter + 1) % self.request_id_counter_max
        return ret_

    def preload_model (self, json_schema):
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
            if not hash_dict.get(self.database_name):
                hash_dict[self.database_name] = get_url_hash(get_url(json_schema))

            # keep reference to model memory from hash (hash - mem model map)
            if not model_dict.get(hash_dict[self.database_name]):
                model_dict[hash_dict[self.database_name]] = {}
                model_type_, model_file_loc_ = download_model(get_url(json_schema), model_dir, self.database_name)
                if model_file_loc_ != None:
                    model_dict[hash_dict[self.database_name]]["type"], model_dict[hash_dict[self.database_name]]["model"] = memload_model(model_type_, model_file_loc_)
                
                if model_dict[hash_dict[self.database_name]].get("model"):
                    logging.debug("Model loaded for database: "+self.database_name)
                    return True
                else:
                    logging.error("Model loading failed for database: "+self.database_name)
                    # reset DB - hash map
                    del hash_dict[self.database_name]
                    return False
            
            # persist to disk # TODO: serialize across objects
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

    async def enqueue_compress_data (self, texts):
        """
        Add to request queue for compression 
        """
        request_ = EncodeRequest(self.count_request_id(), texts)

        await self.request_queue.put(request_)

        return request_.id

    def write_to_disk (self):
        """
        Write all metadata to disk periodically
        """

        pass

    async def process_queue (self):
        """
        Load an already existing model, pop request queue,
        compress information, push to response queue
        """

        request_data = []
        request_metadata = []
        max_batch_len = 64 # model's batching capacity
        # create batch from req. queue
        while(not self.request_queue.empty()):
            # get an item from queue
            section_ = await self.request_queue.get()
            request_data += section_.text
            request_metadata.append( (section_.id, len(section_.text)) )
            # check max. batch length achieved
            if len(request_data) > max_batch_len:
                break


        # prefill model & hash dictionary
        global hash_dict
        if hash_dict == None:
            try:
                hash_dict = read_json_file(data_dir + 'hub_hash_dict.json')
            except Exception as e:
                logging.error("model & hash dict json read error")
                logging.error(e)
                hash_dict = {}

        if not hash_dict.get(self.database_name):
            logging.error("Model not pre-loaded for database: "+self.database_name)
            return []
        if not model_dict.get(hash_dict[self.database_name]):
            # try dynamic loading of model
            try:
                model_dict[hash_dict[self.database_name]] = {}
                model_dict[hash_dict[self.database_name]]["type"], model_dict[hash_dict[self.database_name]]["model"] = memload_model(MODEL_FASTTEXT, model_dir + self.database_name + ".bin")
            except Exception as e:
                logging.error("Model not mem-loaded for database: "+self.database_name)
                logging.error(e)
                return []
        
        result = []
        try:
            # for text in texts:
            # fasttext model prediction
            if model_dict[hash_dict[self.database_name]]["type"] == MODEL_FASTTEXT:
                result = model_dict[hash_dict[self.database_name]]["model"].get_sentence_vector(request_data).tolist()
            # stransformer model prediction
            if model_dict[hash_dict[self.database_name]]["type"] == MODEL_S_TRANSFORMER:
                result = model_dict[hash_dict[self.database_name]]["model"].encode(request_data).tolist()

        except Exception as e:
            logging.error(e)
            logging.error("Model prediction error for database: "+self.database_name)
        
        # add results to response queue
        self.response_queue[request_metadata[0][0]] = result[0:request_metadata[0][1]]
        old_metadata = request_metadata[0]
        for metadata_ in request_metadata[1:]:
            self.response_queue[metadata_[0]] = result[old_metadata[1]:old_metadata[1]+metadata_[1]]
            old_metadata = metadata_
