import unittest

import index # includes preloading databases
import router
from utils import CID
import numpy as np

import time

class TestDocs (unittest.TestCase):

    # A fresh doc is created
    def test_1_doc_fresh_create (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd901",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def)

        # add document
        docs = [{
                "metadata": {
                    "name":"name1", 
                    "age": 20
                },
                "code": [1,2,3]
            }, {
                    "metadata": {
                    "name":"name2", 
                    "age": 30
                },
                "code": [1,2,3]
            }]
        cids = router.insert_docs(docs, database_name)

        self.assertEqual(len(cids), len(docs), "Document creation failed")

    # An incomplete doc is created
    def test_1a_doc_incomplete_create (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd901",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def)

        # add document with "code" missing
        docs = [{
                "metadata": {
                    "name":"name1", 
                    "age": 20
                }
            }, {
                    "metadata": {
                    "name":"name2", 
                    "age": 30
                }
            }]
        cids = router.insert_docs(docs, database_name)

        self.assertEqual(cids, [None, None], "Document creation test failed")

    # An existing doc is created
    def test_2_doc_exist_create (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd901",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def)

        # add existing document
        docs = [{
                "metadata": {
                    "name":"name1", 
                    "age": 20
                },
                "code": [1,2,3]
            }, {
                    "metadata": {
                    "name":"name2", 
                    "age": 30
                },
                "code": [1,2,3]
            }]
        cids = router.insert_docs(docs, database_name)

        self.assertEqual(len(cids), len(docs), "Document creation failed")

    # A non existing DB is used to create doc
    def test_3_db_fresh_doc_create (self):
        # create random DB name
        database_name = "BRANDOM"

        # add existing document
        docs = [{
                "metadata": {
                    "name":"name1", 
                    "age": 20
                },
                "code": [1,2,3]
            }, {
                    "metadata": {
                    "name":"name2", 
                    "age": 30
                },
                "code": [1,2,3]
            }]
        cids = router.insert_docs(docs, database_name)

        self.assertEqual(len(cids), 0, "Document creation failed")

    # A fresh doc is deleted
    def test_4_doc_fresh_delete (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd901fr",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def)

        # delete non existing documents
        cids = router.delete_docs(["sdfsdfsdf", "tret456"], database_name)

        self.assertEqual(len(cids), 0, "Doc deletion failed")

    # An existing doc is deleted for small dataset
    def test_5a_doc_exist_delete_small (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd902",
            "encoder": "example.com/autoencoder/API",
            "codelen": 100,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def)

        # add small epoch document
        docs = []
        # create special doc
        matrix_r_spec = np.random.rand(1, 100)
        docs.append({
            "metadata": {"name":"special", "age":11},
            "code": matrix_r_spec[0].tolist()
        })
        cids_spec = router.insert_docs(docs, database_name)

        # create other docs
        for _ in range(90):
            docs = []
            # create random matrix
            matrix_r = np.random.rand(100, 100)
            # create documents
            for item in matrix_r:
                docs.append({
                    "metadata": {"name":"generic", "age":10},
                    "code": item.tolist()
                })
            
            cids = router.insert_docs(docs, database_name)

        # check for doc existance
        k = 2
        docs, dists = router.search([matrix_r_spec[0].tolist()], k, None, database_name)
        self.assertEqual(docs[0][0]["metadata"]["name"], "special", "Doc doesn't exist")

        # delete special doc
        cids = router.delete_docs(cids_spec, database_name)
        time.sleep(10)

        # check for doc existance
        k = 2
        docs, dists = router.search([matrix_r_spec[0].tolist()], k, None, database_name)
        self.assertEqual(len(docs[0]), k, "Doc deletion failed")
        self.assertEqual(docs[0][0]["metadata"]["name"], "generic", "Doc deletion failed")

    # An existing doc is deleted for large dataset
    def test_5b_doc_exist_delete_large (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd902",
            "encoder": "example.com/autoencoder/API",
            "codelen": 100,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def)

        # add small epoch document
        docs = []
        # create special doc
        matrix_r_spec = np.random.rand(1, 100)
        docs.append({
            "metadata": {"name":"special", "age":11},
            "code": matrix_r_spec[0].tolist()
        })
        cids_spec = router.insert_docs(docs, database_name)

        # create other docs
        for _ in range(120):
            docs = []
            # create random matrix
            matrix_r = np.random.rand(100, 100)
            # create documents
            for item in matrix_r:
                docs.append({
                    "metadata": {"name":"generic", "age":10},
                    "code": item.tolist()
                })
            
            cids = router.insert_docs(docs, database_name)

        time.sleep(60)
        # check for doc existance
        k = 2
        docs, dists = router.search([matrix_r_spec[0].tolist()], k, None, database_name)
        self.assertEqual(docs[0][0]["metadata"]["name"], "special", "Doc doesn't exist")

        # delete special doc
        cids = router.delete_docs(cids_spec, database_name)
        time.sleep(60)

        # check for doc existance
        k = 2
        docs, dists = router.search([matrix_r_spec[0].tolist()], k, None, database_name)
        
        self.assertEqual(len(docs[0]), k, "Doc deletion failed")
        self.assertEqual(docs[0][0]["metadata"]["name"], "generic", "Doc deletion failed")

    # A non existing DB is used to delete doc
    def test_6_db_fresh_doc_delete (self):
        # create random DB name
        database_name = "BRANDOM"

        # delete non existing documents
        cids = router.delete_docs(["sdfsdfsdf", "tret456"], database_name)

        self.assertEqual(len(cids), 0, "Doc deletion failed")

if __name__ == '__main__':
    unittest.main()
