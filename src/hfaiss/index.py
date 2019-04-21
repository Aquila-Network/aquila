import numpy as np
import faiss

class Faiss:
    def __init__(self):
        self.nlist = 1
        self.nprobe = 1
        self.bytesPerVec = 8
        self.bytesPerSubVec = 8
        self.dim = 300

    def initFaiss(self, nlist, nprobe, bytesPerVec, bytesPerSubVec, dim, matrix):
        self.nlist = nlist
        self.nprobe = nprobe
        self.bytesPerVec = bytesPerVec
        self.bytesPerSubVec = bytesPerSubVec
        self.dim = dim

        self.train_data = np.matrix(matrix)
        self.f_quantizer = faiss.IndexFlatL2(d)
        self.f_index = faiss.IndexIVFPQ(quantizer, self.dim, self.nlist, self.bytesPerVec, self.bytesPerSubVec)
        self.f_index.train(self.train_data)
        return True

    def addVectors(self, documents):
        ids = []
        vecs = []
        for document in documents:
            _id = document._id
            vec = document.vector
            ids.append(_id)
            vecs.append(vec)
        
        return True, ids

    def deleteVectors(self, ids):

        return True, ids

    def getNearest(self, matrix, k):
        
        return True, [], [[1.0, 2.0, 3.0]]