import logging

import numpy as np
import faiss
import yaml

import os
import threading
import queue
import time

class Faiss:
    def __init__(self, model_location):
        # set model location
        self.model_location = model_location

        self.is_active = False
        self.nlist = int(os.environ["FAISS_MAX_CELLS"])
        self.nprobe = int(os.environ["FAISS_VISIT_CELLS"])
        self.bytesPerVec = int(os.environ["FAISS_BYTES_PER_VEC"])
        self.bytesPerSubVec = int(os.environ["FAISS_BYTES_PER_SUB_VEC"])
        
        # make sure to parse env variables to their expected type
        self.dim = int(os.environ["FIXED_VEC_DIMENSION"])

        self.model_loaded = self.load_model_from_disk(self.model_location)
        self.is_initiated_ = self.model_loaded

        # to keep the thread & queue running
        self.process_flag = True
        self.q_maxsize = int(os.environ["FIXED_Q_LEN"])
        self.process_thread = None
        self._lock = threading.Lock()
        self.process_timeout_sec = int(os.environ["THREAD_SLEEP"]) # seconds

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

    def init_faiss(self, matrix):
        self.train_data = np.matrix(matrix).astype('float32')
        logging.debug('FAISS init quantizer')
        self.f_quantizer = faiss.IndexFlatL2(self.dim)
        # Lock index read / wtite until it is built
        with self._lock:
            logging.debug('FAISS init index')
            self.f_index = faiss.IndexIVFPQ(self.f_quantizer, self.dim, self.nlist, self.bytesPerVec, self.bytesPerSubVec)
            logging.debug('FAISS train index')
            self.f_index.train(self.train_data)
            logging.debug('FAISS train index finished')

            # write index to disk
            self.model_loaded = self.save_model_to_disk(self.model_location, self.f_index)
        self.is_initiated_ = self.model_loaded

        return self.is_initiated_

    def is_initiated(self):
        return self.is_initiated_

    def load_model_from_disk(self, location):
        try:
            # read index
            self.f_index = faiss.read_index(location)
            logging.debug('FAISS index loading success')
            return True
        except Exception as e: 
            logging.error('FAISS index loading failed' + str(e))
            return False

    def save_model_to_disk(self, location, index):
        try:
            # write index
            faiss.write_index(index, location)
            logging.debug('FAISS index writing success')
            return True
        except:
            logging.error('FAISS index writing failed')
            return False

    def add_vectors(self, documents):
        # add document to queue
        self.pipeline.put({"action":"add", "docs": documents})
        
        return True

    def process(self):
        while (self.process_flag):
            # set a timeout till next vector indexing
            time.sleep(self.process_timeout_sec)

            # check if queue is not empty
            if self.pipeline.qsize() > 0:
                ids = []
                vecs = []
                # f_delete = False
                # f_add = False

                # fetch all currently available documents from queue
                while not self.pipeline.empty():
                    # extract document & contents
                    qitem = self.pipeline.get_nowait()
                    if qitem["action"] == "add":
                        # f_add = True
                        documents = qitem["docs"]
                        for document in documents:
                            _id = document["_id"]
                            vector_e = document["code"]
                            ids.append(_id)
                            vecs.append(vector_e)
                    elif qitem["action"] == "delete":
                        # f_delete = True
                        ids = qitem["ids"]
                        # remove vectors and add zero reset
                        self.f_index.remove_ids(np.array(ids).astype('int'))
                        vecs = np.zeros((len(ids), self.dim))

                # if f_add:
                # convert to np matrix
                vec_data = np.matrix(vecs).astype('float32')
                id_data = np.array(ids).astype('int')

                # Lock index read / wtite until it is built
                with self._lock:
                    # add vectors
                    self.f_index.add_with_ids(vec_data, id_data)

                # if f_delete:
                    # pass
                
                # write to disk
                self.save_model_to_disk(self.model_location, self.f_index)

    def delete_vectors(self, ids):
        # remove vectors
        self.pipeline.put({"action":"delete", "ids": ids})
        
        return True, ids

    def get_nearest_rad(self, matrix, rad):
        pass
        # # convert to np matrix
        # vec_data = np.matrix(matrix).astype('float32')
        
        # # Lock index read / wtite until nearest neighbor search
        # with self._lock:
        #     D, I = self.f_index.search(vec_data, k)
        # return I.tolist(), D.tolist()

    def get_nearest_k(self, matrix, k):
        # convert to np matrix
        vec_data = np.matrix(matrix).astype('float32')
        
        # Lock index read / wtite until nearest neighbor search
        with self._lock:
            D, I = self.f_index.search(vec_data, k)
        return I.tolist(), D.tolist()
