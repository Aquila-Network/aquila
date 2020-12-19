import unittest

import time

import index # includes preloading databases
import router
from utils import CID

import numpy as np

class TestSearch (unittest.TestCase):

    # Perform search on small data
    def test_1_insert_and_search_small (self):
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd903",
            "encoder": "example.com/autoencoder/API",
            "codelen": 100,
            "metadata": {}
        }
        database_name = router.create_database(schema_def)

        # insert documents in bulk --------------------
        for i_ in range(99):
            # create random matrix
            matrix_r = np.random.rand(100, 100)
            # create documents
            docs = []
            for item in matrix_r:
                docs.append({
                "metadata": {},
                "code": item.tolist()
            })

            cids = router.insert_docs(docs, database_name)

        k = 10
        docs, dists = router.search(np.random.rand(1, 784), k, None, database_name)

        self.assertEqual(k, len(docs[0]), "Search failed")

    # Perform search on large data
    def test_2_insert_and_search_large (self):
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd904",
            "encoder": "example.com/autoencoder/API",
            "codelen": 100,
            "metadata": {}
        }
        database_name = router.create_database(schema_def)

        # insert documents in bulk --------------------
        for i_ in range(120):
            # create random matrix
            matrix_r = np.random.rand(100, 100)
            # create documents
            docs = []
            for item in matrix_r:
                docs.append({
                "metadata": {},
                "code": item.tolist()
            })

            cids = router.insert_docs(docs, database_name)

        # time.sleep(5)

        k = 10
        docs, dists = router.search(np.random.rand(1, 784), k, None, database_name)

        self.assertEqual(k, len(docs[0]), "Search failed")

if __name__ == '__main__':
    unittest.main()
