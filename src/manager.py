import logging

from utils import CID, schema

from vec_index import hannoy 

import os
is_mini_instance = os.environ["MINI_AQDB"]
if is_mini_instance == "inactive":
    from vec_index import hfaiss

import plyvel

import numpy as np

import json
import random
import threading
import queue
import time
import pickle

INDEX_LABEL = ["annoy", "faiss"]
STORE_LOCATION = os.environ["DATA_STORE_LOCATION"]

TRAIN_DAT_LEN = int(os.environ["MIN_SAWP_COUNT"])
PROCESS_TIMEOUT = int(os.environ["THREAD_SLEEP"])
MAX_Q_LEN = int(os.environ["FIXED_Q_LEN"])

def byt (inp):
    return bytes(str(inp), 'ascii')

class VecManager:

    def __init__ (self, json_schema):
        # get database name from schema CID
        database_name = CID.doc2CID(json_schema)

        # keep database name
        self.database_name = database_name

        # set DB disk location
        self.DB_disk_location = STORE_LOCATION + database_name

        # create data directory for database
        if not os.path.exists(self.DB_disk_location):
            os.makedirs(self.DB_disk_location)

        # keep schema in store location
        with open(self.DB_disk_location + '/schema.json', 'w') as oschema:
            json.dump(json_schema, oschema)
        
        # get vector index
        self.active_index = INDEX_LABEL[0]
        self.index = self.get_index(self.DB_disk_location)

        # Create KV store instance
        self.KV_store = plyvel.DB(self.DB_disk_location + "/kv.db", create_if_missing=True)
        if self.KV_store.get(byt(-1)) == None:
            self.KV_store.put(byt(-1), byt(0))

        # Training data holder
        self.training_data = []
        self.TD_location = self.DB_disk_location + "/TD"
        # Try loading training data
        self.load_TD_from_disk()

        # spawn worker thread
        self.q_maxsize = MAX_Q_LEN
        self.process_flag = True
        self.process_timeout_sec = PROCESS_TIMEOUT
        self.spawn()

    def __del__(self):
        self.process_flag = False
        if self.process_thread:
            self.process_thread.join()
            logging.debug("Thread stopped")
        # close level database connection
        self.KV_store.close()

    def add_vectors (self, documents):
        # add to KV store
        next_index = int(self.KV_store.get(byt(-1)))

        # check if it is ready to swap index
        if is_mini_instance == "inactive" and next_index > TRAIN_DAT_LEN \
            and self.active_index == INDEX_LABEL[0] \
            and len(self.training_data) >= TRAIN_DAT_LEN:
            # swap index
            self.swap_index(self.DB_disk_location)

        # init batch write to DB
        wb_ = self.KV_store.write_batch()
        for idx_, doc_ in enumerate(documents):
            cid_ = byt(doc_["CID"])
            # resize "code"
            doc_["code"] = self.resize_vector(doc_["code"], int(os.environ["FIXED_VEC_DIMENSION"]))
            # cod_ = pickle.dumps(cod_)
            documents[idx_]["_id"] = next_index

            # TBD: convert to bulk insert
            wb_.put(byt(next_index), byt(len(cid_)) + cid_ + CID.doc2bson(doc_))
            wb_.put(cid_, byt(next_index))
            
            next_index += 1

        wb_.put(byt(-1), byt(next_index))
        # commit DB write
        wb_.write()

        # push to training data
        self.update_training_data(documents)

        # add vectors to index
        return self.index.add_vectors(documents)

    def delete_vectors (self, cids):
        # get ids from cids
        ids_ = []
        wb_ = self.KV_store.write_batch()
        for cid_ in cids:
            id_ = self.KV_store.get(byt(cid_))
            if id_:
                ids_.append(int(id_))
                wb_.delete(id_)
        # commit db write
        wb_.write()
        # delete vectors by ID from index
        status, ids = self.index.delete_vectors(ids_)

        if status and len(ids) == len(cids):
            return cids
        else:
            return []

    def get_nearest (self, qmatrix, k, rad):
        ids = []
        dists = []

        qmatrix = self.resize_matrix(qmatrix, int(os.environ["FIXED_VEC_DIMENSION"]))

        # radius defined, 
        if rad is not None:
            if k is not None:
                ids, dists = self.index.get_nearest_rad(qmatrix, rad)
            else:
                ids, dists = self.index.get_nearest_rad(qmatrix, rad)[:k]
        else:
            ids, dists = self.index.get_nearest_k(qmatrix, k)

        # get docs
        for idx_, idb in enumerate(ids):
            for idx__, id_ in enumerate(idb):
                value = self.KV_store.get(byt(id_))
                if value:
                    cid_len_ = int(value[:2]) + 2
                    ids[idx_][idx__] = CID.bson2doc(value[cid_len_:])
                else:
                    ids[idx_][idx__] = None

        return ids, dists
        

    def get_index (self, location):
        index = None
        annoy_location = location + "/h_annoy"
        faiss_location = location + "/h_faiss"

        if is_mini_instance == "inactive":
            # try loading faiss
            index = hfaiss.Faiss(faiss_location)
            # check if faiss is not loaded,
            if not index.is_initiated():
                # destruct faiss
                del index
                # load annoy
                index = hannoy.Annoy(annoy_location)
                self.active_index = INDEX_LABEL[0]
            else:
                self.active_index = INDEX_LABEL[1]
        else:
            # load annoy
            index = hannoy.Annoy(annoy_location)
            self.active_index = INDEX_LABEL[0]

        return index

    def resize_vector (self, vector, dim):
        # resize vectors
        vector_l = len(vector)
        # check if the vector length is below dimention limit
        # then pad vector with 0 by dimension
        if vector_l < dim:
            vector.extend([0]*(dim-vector_l))
        # make sure vector length doesn't exceed dimension limit
        vector = vector[:dim]
        return vector

    def resize_matrix (self, matrix_, dim):
        # numpize
        matrix = np.array(matrix_)
        # check for valid dimensions
        if matrix.ndim < 2:
            matrix = np.array([matrix_])
        elif matrix.ndim > 2:
            logging.error("Invalid query dimensions")
            return [[]]

        # resize vectors
        vector_l = len(matrix_[0])
        # check if the vector length is below dimention limit
        # then pad vector with 0 by dimension
        if vector_l < dim:
            matrix = np.pad(matrix, ((0, 0), (0, dim-vector_l)))
        # make sure vector length doesn't exceed dimension limit
        matrix = matrix[:, :dim]
        # listize
        return matrix.tolist()

    def swap_index (self, location):
        logging.debug("Swapping index to FAISS")
        
        faiss_location = location + "/h_faiss"

        # init faiss index
        self.index = hfaiss.Faiss(faiss_location)

        # train faiss index
        self.index.init_faiss(self.training_data)

        # migrate data
        for idx_ in range(int(self.KV_store.get(byt(-1)))):
            value = self.KV_store.get(byt(idx_))
            
            if value:
                cid_len_ = int(value[:2]) + 2

                self.index.add_vectors([{
                    "_id": int(idx_),
                    "code": CID.bson2doc(value[cid_len_:])["code"]
                }])

        # set active index
        self.active_index = INDEX_LABEL[1]

    def update_training_data (self, documents):
        # insert new vectors to array
        self.pipeline.put(documents)

    def save_TD_to_disk (self):
        try:
            # write index
            np.save(self.TD_location, np.array(self.training_data))
            logging.debug('Training data writing success')
            return True
        except Exception as e:
            logging.error('Training data writing failed' + str(e))
            return False

    def load_TD_from_disk (self):
        try:
            # load training data
            self.training_data = np.load(self.TD_location+'.npy').tolist()
            logging.debug('Training data loaded successfully')
            return True
        except Exception as e:
            logging.error('Training data loading failed' + str(e))
            self.training_data = []
            return False

    def process (self):
        while (self.process_flag):

            # set a timeout
            time.sleep(self.process_timeout_sec)

            # check if queue is not empty
            if not self.pipeline.empty():
            
                # fetch all currently available codes from queue
                while not self.pipeline.empty():
                    # pop available codes
                    for doc_ in self.pipeline.get_nowait():
                        self.training_data.append(doc_["code"])

                # shuffle array
                random.shuffle(self.training_data)
                # resize array
                self.training_data = self.training_data[:TRAIN_DAT_LEN]
                
                # write to disk
                self.save_TD_to_disk()

    def spawn (self):
        # create pipeline to add documents
        self.pipeline = queue.Queue(maxsize=self.q_maxsize)
        # create process thread
        self.process_thread = threading.Thread(target=self.process, args=(), daemon=True)
        # start process thread
        self.process_thread.start()
    