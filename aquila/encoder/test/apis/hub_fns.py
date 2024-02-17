import unittest

from utils import CID, schema

from Crypto.Hash import SHA384
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
import base58

import requests
from requests.structures import CaseInsensitiveDict
import json
import bson

host = "127.0.0.1:5002"


# load private key
with open("private_unencrypted.pem", "r") as pkf:
    k = pkf.read()
    priv_key = RSA.import_key(k)

class TestAuth (unittest.TestCase):

    # Preload a model
    def test_1_auth_preload_http (self):

        schema_def_ = {
            "description": "this is my database",
            "unique": "r8and0mseEd905",
            "encoder": "ftxt:https://ftxt-models.s3.us-east-2.amazonaws.com/ftxt_base_min.bin",
            "codelen": 25,
            "metadata": {}
        }

        # generate schema 
        schema_def = schema.generate_schema(schema_def_)
        database_name = CID.doc2CID(schema_def)

        # 1. test preperation
        data_ = { "schema": schema_def_ }
        data_bson = bson.dumps(data_)
        # generate hash
        hash = SHA384.new()
        hash.update(data_bson)
        
        # Sign with pvt key
        signer = pkcs1_15.new(priv_key)
        signature = signer.sign(hash)
        signature = base58.b58encode(signature).decode("utf-8")

        url = "http://"+host+"/prepare"

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
        data_ = {"databaseName": database_name_, "text": ["data one", "data two"]}
        url = "http://"+host+"/compress"

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

    # Preload a model
    def test_2_auth_preload_ipfs (self):

        schema_def_ = {
            "description": "this is my database",
            "unique": "r8and0mseEd905",
            "encoder": "ftxt:ipfs://QmT9CECrTwUhAPw6VHgxcLciH4EBepkXJmSB9y2rchsVQz",
            "codelen": 25,
            "metadata": {}
        }

        # generate schema 
        schema_def = schema.generate_schema(schema_def_)
        database_name = CID.doc2CID(schema_def)

        # 1. test preperation
        data_ = { "schema": schema_def_ }
        data_bson = bson.dumps(data_)
        # generate hash
        hash = SHA384.new()
        hash.update(data_bson)
        
        # Sign with pvt key
        signer = pkcs1_15.new(priv_key)
        signature = signer.sign(hash)
        signature = base58.b58encode(signature).decode("utf-8")

        url = "http://"+host+"/prepare"

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
        url = "http://"+host+"/compress"

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


if __name__ == '__main__':
    unittest.main()
