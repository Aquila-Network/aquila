import numpy as np
from annoy import AnnoyIndex
import yaml
import os

model_location = '/data/VDB/model_ha'

class Annoy:
    def __init__(self):
        self.total = 0
        try:
            with open('DB_config.yml', 'r') as stream:
                DB_config = yaml.safe_load(stream)
                self.dim = os.getenv('FIXED_VEC_DIMENSION', DB_config['annoy']['init']['vd'])
                self.sim_metric = os.getenv('ANNOY_SIM_METRIC', DB_config['annoy']['init']['smetric'])
                self.n_trees = os.getenv('ANNOY_NTREES', DB_config['annoy']['init']['ntrees'])
                self.search_k = os.getenv('ANNOY_KSEARCH', DB_config['annoy']['init']['searchk'])
                self.modelLoaded = self.loadModelFromDisk(model_location)
        except Exception as e:
            print('Error initializing Annoy: ', e)

    def initAnnoy(self):
        # only do if no index loaded from disk
        if not self.modelLoaded:
            print('Annoy init index')
            self.a_index = AnnoyIndex(self.dim, self.sim_metric)

        # build index
        build_ = self.a_index.build(self.n_trees)

        if build_:
            self.modelLoaded = self.saveModelToDisk(model_location, self.a_index)
        return self.modelLoaded

    def addVectors(self, documents):
        self.total = self.total + len(documents)
        print(self.total, '==========================================')
        ids = []
        # unbuild annoy index before adding new data
        self.a_index.unload()
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
            self.a_index.add_item(int(_id), vector_e)
            
        # build vector
        build_ = self.a_index.build(self.n_trees)
        if build_:
            self.modelLoaded = self.saveModelToDisk(model_location, self.a_index)
        return self.modelLoaded, ids

    def deleteVectors(self, ids):

        return True, ids

    def getNearest(self, matrix, k):
        ids = []
        dists = []
        print(k, self.a_index.get_n_items(), self.search_k)

        for vec_data in matrix:
            _id, _dist = self.a_index.get_nns_by_vector(vec_data, k, search_k=self.search_k, include_distances=True)
            ids.append(_id)
            dists.append(_dist)

        print(ids)
        return True, ids, dists

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