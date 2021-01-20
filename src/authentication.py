from utils import cryptops

import os

pub_key = cryptops.read_public_key(os.environ["AUTH_KEY_FILE"])

def check (json_data, signature):
    return cryptops.verify_signature(json_data, pub_key, signature)