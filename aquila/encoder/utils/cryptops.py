import logging

from Crypto.Hash import SHA384
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15

import base58

import chardet

import bson

def read_public_key (location):
    # disk read public key
    with open(location, "r") as pkf:
        k = pkf.read()
        pub_key = RSA.import_key(k)

        return pub_key

def verify_signature (json_data, pub_key, signature):
    
    ret = True

    binary_data = bson.dumps(json_data)

    # generate hash
    hash = SHA384.new()
    hash.update(binary_data)
    
    signature = base58.b58decode(signature)

    # Verify with pub key
    verifier = pkcs1_15.new(pub_key)
    
    try:
        verifier.verify(hash, signature)
    except Exception as e:
        logging.debug(e)
        ret = False

    return ret