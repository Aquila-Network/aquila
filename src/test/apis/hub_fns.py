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

    # Preload a model
    def test_1_auth_preload_http (self):
        # deploy app
        index.server.start()

        schema_def_ = {
            "description": "this is my database",
            "unique": "r8and0mseEd905",
            "encoder": "ftxt:http://127.0.0.1:8000/model.zip",
            "codelen": 100,
            "metadata": {}
        }

        # generate schema 
        schema_def = schema.generate_schema(schema_def_)
        database_name = CID.doc2CID(schema_def)

        # 1. test preperation
        data_ = { "databaseName": "C7wC5HxudawNxvwmPK4SriBfCkHtiRRPG1t9b1xyDwjY", "schema": schema_def }
        data_bson = bson.dumps(data_)
        # generate hash
        hash = SHA384.new()
        hash.update(data_bson)
        
        # Sign with pvt key
        signer = pkcs1_15.new(priv_key)
        signature = signer.sign(hash)
        signature = base58.b58encode(signature).decode("utf-8")

        url = "http://0.0.0.0:5002/prepare"

        headers = CaseInsensitiveDict()
        headers["Content-Type"] = "application/json"

        data = {
            "data": data_,
            "signature": signature
        }

        data = json.dumps(data)


        resp = requests.post(url, headers=headers, data=data)
        
        database_name_ = resp.json()["databaseName"]
        # check databases are the same
        self.assertEqual(database_name, database_name_, "DB name doesn't match")

        # 2. test compression
        data_ = {"databaseName": data_["databaseName"], "text": ["data one", "data two"]}
        url = "http://0.0.0.0:5002/compress"

        headers = CaseInsensitiveDict()
        headers["Content-Type"] = "application/json"

        data = {
            "data": data_
        }

        data = json.dumps(data)


        resp = requests.post(url, headers=headers, data=data)

        # # check returned array is valid
        self.assertEqual(len(resp.json()["vectors"]), len(data_["text"]), "Compressed items doesn't match query")
        self.assertEqual(len(resp.json()["vectors"][0]), schema_def_["codelen"], "Compressed code length doesn't match")

        # stop server
        # index.server.terminate()
        # index.server.join()

    # Preload a model
    def test_2_auth_preload_ipfs (self):
        # deploy app
        # index.server.start()

        schema_def_ = {
            "description": "this is my database",
            "unique": "r8and0mseEd905",
            "encoder": "ftxt:ipfs://QmT9CECrTwUhAPw6VHgxcLciH4EBepkXJmSB9y2rchsVQz",
            "codelen": 100,
            "metadata": {}
        }

        # generate schema 
        schema_def = schema.generate_schema(schema_def_)
        database_name = CID.doc2CID(schema_def)

        # 1. test preperation
        data_ = { "databaseName": "A1HpJCgrj763HjrR719ukrQWymAUXNaQE6u1QfnCEDLH", "schema": schema_def }
        data_bson = bson.dumps(data_)
        # generate hash
        hash = SHA384.new()
        hash.update(data_bson)
        
        # Sign with pvt key
        signer = pkcs1_15.new(priv_key)
        signature = signer.sign(hash)
        signature = base58.b58encode(signature).decode("utf-8")

        url = "http://0.0.0.0:5002/prepare"

        headers = CaseInsensitiveDict()
        headers["Content-Type"] = "application/json"

        data = {
            "data": data_,
            "signature": signature
        }

        data = json.dumps(data)


        resp = requests.post(url, headers=headers, data=data)
        
        database_name_ = resp.json()["databaseName"]
        # check databases are the same
        self.assertEqual(database_name, database_name_, "DB name doesn't match")

        # 2. test compression
        data_ = {"databaseName": data_["databaseName"], "text": ["data one", "data two"]}
        url = "http://0.0.0.0:5002/compress"

        headers = CaseInsensitiveDict()
        headers["Content-Type"] = "application/json"

        data = {
            "data": data_
        }

        data = json.dumps(data)


        resp = requests.post(url, headers=headers, data=data)

        # check returned array is valid
        self.assertEqual(len(resp.json()["vectors"]), len(data_["text"]), "Compressed items doesn't match query")
        self.assertEqual(len(resp.json()["vectors"][0]), schema_def_["codelen"], "Compressed code length doesn't match")

        # stop server
        index.server.terminate()
        index.server.join()

if __name__ == '__main__':
    unittest.main()
