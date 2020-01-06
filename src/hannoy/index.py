import numpy as np
from annoy import AnnoyIndex
import yaml
import os

import threading
import queue
import time

model_location = '/data/model_ha'

class Annoy:
    def __init__(self):
        # to keep the thread & queue running
        self.process_flag = True
        self.q_maxsize = 10100
        self.process_thread = None
        self._lock = threading.Lock()
        self.process_timeout_sec = 5 # seconds
        # this is to keep track of all vectors inserted
        # for saving into disk and retrieve later
        self.index_disk = None
        try:
            with open('DB_config.yml', 'r') as stream:
                DB_config = yaml.safe_load(stream)
                self.dim = os.getenv('FIXED_VEC_DIMENSION', DB_config['annoy']['init']['vd'])
                self.sim_metric = os.getenv('ANNOY_SIM_METRIC', DB_config['annoy']['init']['smetric'])
                self.n_trees = os.getenv('ANNOY_NTREES', DB_config['annoy']['init']['ntrees'])
                self.search_k = os.getenv('ANNOY_SEARCHK', DB_config['annoy']['init']['search_k'])
                self.modelLoaded = self.loadModelFromDisk()
        except Exception as e:
            print('Error initializing Annoy: ', e)

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

    def initAnnoy(self):
        # only do if no index loaded from disk
        if not self.modelLoaded:
            print('Annoy init index')
            self.a_index = AnnoyIndex(self.dim, self.sim_metric)

        # Lock index read / wtite until it is built
        with self._lock:
            # build index
            build_ = self.a_index.build(self.n_trees)

            if build_:
                self.modelLoaded = self.saveModelToDisk()

        return self.modelLoaded

    def addVectors(self, documents):
        ids = []
        # add vectors
        for document in documents:
            # add document to queue
            self.pipeline.put_nowait(document)
            ids.append(document._id)
        return True, ids

    def process(self):
        while (self.process_flag):
            # print(list(self.pipeline.queue))

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
                        document = self.pipeline.get_nowait()
                        _id = document._id
                        vec = document.vector
                        vector_e = vec.e

                        # resize vectors
                        vector_e_l = len(vector_e)
                        # check if the vector length is below dimention limit
                        # then pad vector with 0 by dimension
                        if vector_e_l < self.dim:
                            vector_e.extend([0]*(self.dim-vector_e_l))
                        # make sure vector length doesn't exceed dimension limit
                        vector_e = vector_e[:self.dim]
                    
                        # add vector to index
                        self.a_index.add_item(int(_id), vector_e)
                        # keep a copy for disk storage
                        list_ = vector_e
                        list_.append(int(_id))
                        # append to disk proxy
                        if self.index_disk is None:
                            self.index_disk = np.array([list_], dtype=float)
                        else:
                            self.index_disk = np.append(self.index_disk, [list_], axis=0)
                    
                    # build vector
                    build_ = self.a_index.build(self.n_trees)

                # write to disk
                if build_:
                    self.modelLoaded = self.saveModelToDisk()

    def deleteVectors(self, ids):

        return True, ids

    def getNearest(self, matrix, k):
        ids = []
        dists = []

        # Lock index read / wtite until nearest neighbor search
        with self._lock:
            for vec_data in matrix:
                if self.search_k != -1:
                    _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, self.search_k, include_distances=True)
                else 
                    _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, include_distances=True)
            ids.append(_id)
            dists.append(_dist)

        return True, ids, dists

    def loadModelFromDisk(self):
        try:
            # prepare new index
            self.a_index = AnnoyIndex(self.dim, self.sim_metric)
            # read index
            self.index_disk = np.load(model_location+'.npy')
            # build Annoy Index
            for vec_ in self.index_disk.tolist():
                self.a_index.add_item(int(vec_[-1]), vec_[0:-1])
            # build index
            build_ = self.a_index.build(self.n_trees)
            print('Annoy index loading success')
            return True
        except Exception as e: 
            print('Annoy index loading failed')
            return False

    def saveModelToDisk(self):
        try:
            # write index
            np.save(model_location, self.index_disk)
            print('Annoy index writing success')
            return True
        except:
            print('Annoy index writing failed')
            return False