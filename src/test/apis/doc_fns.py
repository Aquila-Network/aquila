import unittest

import index # includes preloading databases
import router
from utils import CID

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
            "unique": "r8and0mseEd901",
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

    # An existing doc is deleted
    def test_5_doc_exist_delete (self):
        # create database
        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd902",
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
        # delete existing documents
        cids = router.delete_docs(cids, database_name)

        self.assertEqual(len(cids), len(docs), "Doc deletion failed")

    # A non existing DB is used to delete doc
    def test_6_db_fresh_doc_delete (self):
        # create random DB name
        database_name = "BRANDOM"

        # delete non existing documents
        cids = router.delete_docs(["sdfsdfsdf", "tret456"], database_name)

        self.assertEqual(len(cids), 0, "Doc deletion failed")

if __name__ == '__main__':
    unittest.main()
