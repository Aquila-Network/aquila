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

        #self.train_data = np.matrix(matrix)
        #self.f_quantizer = faiss.IndexFlatL2(self.dim)
        #self.f_index = faiss.IndexIVFPQ(self.f_quantizer, self.dim, self.nlist, self.bytesPerVec, self.bytesPerSubVec)
        #self.f_index.train(self.train_data)
        nlist = self.nlist
        m = self.bytesPerVec             # number of bytes per vector
        k = 4
        d = self.dim                     # dimension
        nb = 10000                      # database size
        nq = 100                       # nb of queries
        np.random.seed(1234)             # make reproducible
        xb = np.random.random((nb, d)).astype('float32')
        xb[:, 0] += np.arange(nb) / 1000.
        xq = np.random.random((nq, d)).astype('float32')
        xq[:, 0] += np.arange(nq) / 1000.
        quantizer = faiss.IndexFlatL2(d)  # this remains the same
        index = faiss.IndexIVFPQ(quantizer, d, nlist, m, self.bytesPerSubVec)
                                            # 8 specifies that each sub-vector is encoded as 8 bits
        index.train(xb)
        index.add(xb)
        D, I = index.search(xb[:5], k) # sanity check
        print(I)
        print(D)
        index.nprobe = self.nprobe     # make comparable with experiment above
        D, I = index.search(xq, k)     # search
        print(I[-5:])
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