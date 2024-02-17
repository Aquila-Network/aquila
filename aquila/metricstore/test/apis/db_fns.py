import unittest

import index # includes preloading databases
import router
from utils import CID, schema

class TestDB (unittest.TestCase):

    # A fresh DB is created
    def test_1_db_fresh_create (self):
        schema_def1 = {
            "description": "this is my database",
            "unique": "r8and0mseEd90",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        schema_def2 = {
            "description": "this is my database",
            "unique": "r8and0mseEd90",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def1)

        schema_def = schema.generate_schema(schema_def2)
        database_name_ = CID.doc2CID(schema_def)

        self.assertEqual(database_name, database_name_, "DB name doesn't match")

    # An existing DB is created
    def test_2_db_exist_create (self):
        schema_def1 = {
            "description": "this is my database",
            "unique": "r8and0mseEd90",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        schema_def2 = {
            "description": "this is my database",
            "unique": "r8and0mseEd90",
            "encoder": "example.com/autoencoder/API",
            "codelen": 3,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        database_name = router.create_database(schema_def1)

        schema_def = schema.generate_schema(schema_def2)
        database_name_ = CID.doc2CID(schema_def)

        self.assertEqual(database_name, database_name_, "DB name doesn't match")

if __name__ == '__main__':
    unittest.main()
