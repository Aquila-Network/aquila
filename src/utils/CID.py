import logging

import bson
import hashlib
import base58

def doc2CID (inp):
    try:
        # JSON OBJ to BSON encode
        bson_ = bson.dumps(inp)
        # SHA-256 Double Hashing
        hash_ = hashlib.sha256(bson_)
        hash_ = hashlib.sha256(hash_.digest())
        # Convert to Base-58 string
        b58c_ = base58.b58encode(hash_.digest())

        return b58c_.decode('utf-8')
    except Exception as e:
        logging.debug(e)
        return None

def doc2bson (inp):
    try:
        # JSON OBJ to BSON encode
        bson_ = bson.dumps(inp)

        return bson_
    except Exception as e:
        logging.debug(e)
        return None

def bson2doc (inp):
    try:
        # BSON to JSON OBJ
        json_ = bson.loads(inp)

        return json_
    except Exception as e:
        logging.debug(e)
        return None