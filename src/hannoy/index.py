import numpy as np
from annoy import AnnoyIndex
import yaml
import os

model_location = '/data/VDB/model_ha'

class Annoy:
    def __init__(self):
        self.total = 0
        # this is to keep track of all vectors inserted
        # for saving into disk and retrieve later
        self.index_disk = None
        try:
            with open('DB_config.yml', 'r') as stream:
                DB_config = yaml.safe_load(stream)
                self.dim = os.getenv('FIXED_VEC_DIMENSION', DB_config['annoy']['init']['vd'])
                self.sim_metric = os.getenv('ANNOY_SIM_METRIC', DB_config['annoy']['init']['smetric'])
                self.n_trees = os.getenv('ANNOY_NTREES', DB_config['annoy']['init']['ntrees'])
                self.search_k = os.getenv('ANNOY_KSEARCH', DB_config['annoy']['init']['searchk'])
                self.modelLoaded = self.loadModelFromDisk()
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
            self.modelLoaded = self.saveModelToDisk()
        return self.modelLoaded

    def addVectors(self, documents):
        # unbuild index first 
        self.a_index.unbuild()
        self.total = self.total + len(documents)
        ids = []
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
            # keep a copy for disk storage
            list_ = vector_e
            list_.append(int(_id))
            if self.index_disk is None:
                self.index_disk = np.array([list_], dtype=float)
            else:
                self.index_disk = np.append(self.index_disk, [list_], axis=0)
            
        # build vector
        build_ = self.a_index.build(self.n_trees)
        if build_:
            self.modelLoaded = self.saveModelToDisk()
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