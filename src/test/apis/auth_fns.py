import unittest

import index
from utils import CID, schema

from Crypto.Hash import SHA384
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import base58

import requests
from requests.structures import CaseInsensitiveDict
import json
import bson


# load private key
with open("/ossl/private_unencrypted.pem", "r") as pkf:
    k = pkf.read()
    priv_key = RSA.import_key(k)

class TestAuth (unittest.TestCase):

    # A fresh DB is created
    def test_1_auth_create_db (self):
        # deploy app
        index.server.start()

        schema_def = {
            "description": "this is my database",
            "unique": "r8and0mseEd905",
            "encoder": "example.com/autoencoder/API",
            "codelen": 30,
            "metadata": {
                "name": "string",
                "age": "number"
            }
        }
        data_ = { "schema": schema_def }
        data_bson = bson.dumps(data_)
        # generate hash
        hash = SHA384.new()
        hash.update(data_bson)
        
        # Sign with pvt key
        signer = pkcs1_15.new(priv_key)
        signature = signer.sign(hash)
        signature = base58.b58encode(signature).decode("utf-8")

        url = "http://127.0.0.1:5000/db/create"

        headers = CaseInsensitiveDict()
        headers["Content-Type"] = "application/json"

        data = {
            "data": data_,
            "signature": signature
        }

        data = json.dumps(data)


        resp = requests.post(url, headers=headers, data=data)
        
        database_name_ = resp.json()["database_name"]

        schema_def = schema.generate_schema(schema_def)
        database_name = CID.doc2CID(schema_def)

        index.server.terminate()
        index.server.join()

        self.assertEqual(database_name, database_name_, "DB name doesn't match")

if __name__ == '__main__':
    unittest.main()
