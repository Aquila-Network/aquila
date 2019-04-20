import numpy as np

class Faiss:
    def __init__(self):
        self.nlist = 1
        self.nprobe = 1
        self.bytesPerVec = 8
        self.bytesPerSubVec = 8
        self.dim = 300

    def initFaiss(self, nlist, nprobe, bytesPerVec, bytesPerSubVec, dim):
        self.nlist = nlist
        self.nprobe = nprobe
        self.bytesPerVec = bytesPerVec
        self.bytesPerSubVec = bytesPerSubVec
        self.dim = dim
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