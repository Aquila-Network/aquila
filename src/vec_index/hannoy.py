import logging

import numpy as np
from annoy import AnnoyIndex
import yaml
import os

import threading
import queue
import time

class Annoy:
    def __init__(self, model_location):
        # set model location
        self.model_location = model_location

        # to keep the thread & queue running
        self.process_flag = True
        self.q_maxsize = int(os.environ["FIXED_Q_LEN"])
        self.build_batch_size = int(os.environ["FIXED_Q_LEN"])
        self.process_thread = None
        self._lock = threading.Lock()
        self.process_timeout_sec = int(os.environ["THREAD_SLEEP"]) # seconds
        # this is to keep track of all vectors inserted
        # for saving into disk and retrieve later
        self.index_disk = None
        try:
            # make sure to parse env variables to their expected type
            self.dim = int(os.environ["FIXED_VEC_DIMENSION"])
            self.sim_metric = str(os.environ["ANNOY_SIM_METRIC"])
            self.n_trees = int(os.environ["ANNOY_NTREES"])
            self.search_k = int(os.environ["ANNOY_SK"])
            self.model_loaded = self.load_model_from_disk()
            if not self.model_loaded:
                if self.init_annoy():
                    logging.debug("Annoy Init done")
                else:
                    logging.debug("Annoy Init Failed")
        except Exception as e:
            logging.error('Error initializing Annoy: ' + e)

        # spawn process thread
        self.spawn()

    def __del__(self):
        self.process_flag = False
        if self.process_thread:
            self.process_thread.join()

    def spawn (self):
        # create pipeline to add documents
        self.pipeline = queue.Queue(maxsize=self.q_maxsize)
        # create process thread
        self.process_thread = threading.Thread(target=self.process, args=(), daemon=True)
        # start process thread
        self.process_thread.start()
        # return self.pipeline

    def init_annoy(self):
        # only do if no index loaded from disk
        if not self.model_loaded:
            logging.debug('Annoy init index')
            self.a_index = AnnoyIndex(self.dim, self.sim_metric)

        # Lock index read / wtite until it is built
        with self._lock:
            # build index
            build_ = self.a_index.build(self.n_trees)

            if build_:
                self.model_loaded = self.save_model_to_disk()

        return self.model_loaded

    def add_vectors(self, documents):
        # add documents to queue
        self.pipeline.put({"action":"add", "docs": documents})
        
        return True

    def process(self):
        while (self.process_flag):
            # set a timeout till next vector indexing
            time.sleep(self.process_timeout_sec)

            # check if queue is not empty
            if self.pipeline.qsize() > 0:
                # Lock index read / wtite until it is built
                with self._lock:

                    # unbuild index first 
                    self.a_index.unbuild()

                    # fetch all currently available documents from queue
                    while not self.pipeline.empty():
                        # extract document & contents
                        qitem = self.pipeline.get_nowait()
                        if qitem["action"] == "add":
                            documents = qitem["docs"]
                            for document in documents:
                                _id = document["_id"]
                                vector_e = document["code"]
                            
                                # add vector to index
                                self.a_index.add_item(int(_id), vector_e)
                                # append to disk proxy
                                if self.index_disk is None:
                                    self.index_disk = np.array([vector_e + [int(_id)]], dtype=float)
                                else:
                                    self.index_disk = np.append(self.index_disk, [vector_e + [int(_id)]], axis=0)
                        elif qitem["action"] == "delete":
                            ids = qitem["ids"]
                            # reset
                            zero_ = np.zeros(self.dim + 1)
                            for id_ in ids:
                                # add zero vector to index
                                self.a_index.add_item(int(id_), zero_[:-1].tolist())
                            # reset npy disk array
                            if self.index_disk is not None:
                                self.index_disk[ids] = zero_

                        # take a rest if doc length is > batch_size
                        if len(documents) > self.build_batch_size:
                            break
                    
                    # build vector
                    build_ = self.a_index.build(self.n_trees, n_jobs=-1)

                # write to disk
                if build_:
                    self.model_loaded = self.save_model_to_disk()

    def delete_vectors(self, ids):
        # add documents to queue
        self.pipeline.put({"action":"delete", "docs": ids})

        return True

    def get_nearest_k(self, matrix, k):
        ids = []
        dists = []

        # Lock index read / wtite until nearest neighbor search
        with self._lock:
            for vec_data in matrix:
                if self.search_k != -1:
                    _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, self.search_k, include_distances=True)
                else: 
                    _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, include_distances=True)
            ids.append(_id)
            dists.append(_dist)

        return ids, dists

    def get_nearest_rad(self, matrix, rad):
        ids = []
        dists = []

        # Lock index read / wtite until nearest neighbor search
        with self._lock:
            for vec_data in matrix:
                if self.search_k != -1:
                    _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, self.search_k, include_distances=True)
                else: 
                    _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, include_distances=True)
            ids.append(_id)
            dists.append(_dist)

        return ids, dists

    def load_model_from_disk(self):
        try:
            # prepare new index
            self.a_index = AnnoyIndex(self.dim, self.sim_metric)
            # read index
            self.index_disk = np.load(self.model_location+'.npy')
            # build Annoy Index
            for vec_ in self.index_disk.tolist():
                self.a_index.add_item(int(vec_[-1]), vec_[0:-1])
            # build index
            build_ = self.a_index.build(self.n_trees)
            logging.debug('Annoy index loading success')
            return True
        except Exception as e: 
            logging.debug('Annoy index loading failed. Creating new index..')
            return False

    def save_model_to_disk(self):
        try:
            # write index
            np.save(self.model_location, self.index_disk)
            logging.debug('Annoy index writing success')
            return True
        except Exception as e:
            logging.error('Annoy index writing failed' + e)
            return False
