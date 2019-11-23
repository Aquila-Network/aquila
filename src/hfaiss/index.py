import numpy as np
import faiss

import threading
import queue
import time

model_location = '/data/model_hf'

class Faiss:
    def __init__(self):
        self.nlist = 1
        self.nprobe = 1
        self.bytesPerVec = 8
        self.bytesPerSubVec = 8
        self.dim = 300
        self.modelLoaded = self.loadModelFromDisk(model_location)
        self.is_initiated = self.modelLoaded

        # to keep the thread & queue running
        self.process_flag = True
        self.q_maxsize = 10100
        self.process_thread = None
        self._lock = threading.Lock()
        self.process_timeout_sec = 5 # seconds

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

    def initFaiss(self, nlist, nprobe, bytesPerVec, bytesPerSubVec, dim, matrix):
        self.nlist = nlist
        self.nprobe = nprobe
        self.bytesPerVec = bytesPerVec
        self.bytesPerSubVec = bytesPerSubVec
        self.dim = dim

        self.train_data = np.matrix(matrix).astype('float32')
        print('FAISS init quantizer', self.train_data, self.train_data.shape)
        self.f_quantizer = faiss.IndexFlatL2(self.dim)
        # Lock index read / wtite until it is built
        with self._lock:
            print('FAISS init index')
            self.f_index = faiss.IndexIVFPQ(self.f_quantizer, self.dim, self.nlist, self.bytesPerVec, self.bytesPerSubVec)
            print('FAISS train index')
            self.f_index.train(self.train_data)
            print('FAISS train index finished')

            # write index to disk
            self.modelLoaded = self.saveModelToDisk(model_location, self.f_index)
        self.is_initiated = self.modelLoaded

        return self.is_initiated

    def isInitiated(self):
        return self.is_initiated

    def loadModelFromDisk(self, location):
        try:
            # read index
            self.f_index = faiss.read_index(location)
            print('FAISS index loading success')
            return True
        except Exception as e: 
            print('FAISS index loading failed', e)
            return False

    def saveModelToDisk(self, location, index):
        try:
            # write index
            faiss.write_index(index, location)
            print('FAISS index writing success')
            return True
        except:
            print('FAISS index writing failed')
            return False

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
                ids = []
                vecs = []

                # fetch all currently available documents from queue
                while not self.pipeline.empty():
                    # extract document & contents
                    document = self.pipeline.get_nowait()
                    _id = document._id
                    vec = document.vector
                    ids.append(_id)
                    vector_e = vec.e
                    vector_e_l = len(vector_e)
                    # check if the vector length is below dimention limit
                    # then pad vector with 0 by dimension
                    if vector_e_l < self.dim:
                        vector_e.extend([0]*(self.dim-vector_e_l))
                    # make sure vector length doesn't exceed dimension limit
                    vecs.append(vector_e[:self.dim])

                # convert to np matrix
                vec_data = np.matrix(vecs).astype('float32')
                id_data = np.array(ids).astype('int')

                # Lock index read / wtite until it is built
                with self._lock:
                    # add vector
                    self.f_index.add_with_ids(vec_data, id_data)
                
                # write to disk
                self.saveModelToDisk(model_location, self.f_index)

    def deleteVectors(self, ids):

        return True, ids

    def getNearest(self, matrix, k):
        # convert to np matrix
        vec_data = np.matrix(matrix).astype('float32')
        
        # Lock index read / wtite until nearest neighbor search
        with self._lock:
            D, I = self.f_index.search(vec_data, k)
        return True, I.tolist(), D.tolist()