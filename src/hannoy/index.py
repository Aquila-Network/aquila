import numpy as np
from annoy import AnnoyIndex

model_location = '/data/VDB/model_ha'

class Annoy:
    def __init__(self):
        self.dim = 300
        self.sim_metric = 'angular'
        self.n_trees = 10
        self.modelLoaded = self.loadModelFromDisk(model_location)

    def initAnnoy(self, dim, metric, matrix):
        self.sim_metric = metric
        self.dim = dim

        print('Annoy init index')
        self.a_index = AnnoyIndex(self.dim, self.sim_metric)
        build_ = self.a_index.build(self.n_trees)

        if build_:
            self.modelLoaded = self.saveModelToDisk(self, model_location, self.a_index)
        return self.modelLoaded

    def loadModelFromDisk(self, location):
        try:
            # read index
            self.a_index = AnnoyIndex(self.dim, self.sim_metric)
            self.a_index.load(location)
            print('Annoy index loading success')
            return True
        except: 
            print('Annoy index loading failed')
            return False

    def saveModelToDisk(self, location, index):
        try:
            # write index
            index.save(location)
            print('Annoy index writing success')
            return True
        except:
            print('Annoy index writing failed')
            return False

    def addVectors(self, documents):
        ids = []
        # unbuild annoy index before adding new data
        self.a_index.unbuild()
        # add vectors
        for document in documents:
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
            vector_e = vector_e[:self.dim]
        
            # add vector
            self.a_index.add_with_ids(vector_e, _id)

        # build vector
        build_ = self.a_index.build(self.n_trees)
        if build_:
            self.modelLoaded = self.saveModelToDisk(self, model_location, self.a_index)
        return self.modelLoaded, ids

    def deleteVectors(self, ids):

        return True, ids

    def getNearest(self, matrix, k):
        ids = []
        dists = []

        for vec_data in matrix:
            _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, include_distances=True)
            ids.append(_id)
            dists.append(_dist)
            
        return True, ids, dists