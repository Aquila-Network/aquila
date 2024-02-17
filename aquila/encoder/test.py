from aquilapy import Wallet, DB, Hub
import numpy as np
import time

import multiprocessing as mp

# Create a wallet instance from private key
wallet = Wallet("/home/iamjbn/aquilax/ossl/private_unencrypted.pem")

host = "http://127.0.0.1"

# Connect to Aquila Hub instance
hub = Hub(host, "5002", wallet)

# Schema definition to be used
schema_def = {
    "description": "AquilaX-CE default user index",
    "unique": "user_id1",
    "encoder": "ftxt:http://0.0.0.0:2000/cc.en.300.bin",
    "codelen": 300,
    "metadata": {
        "url": "string",
        "text": "string"
    }
}

def run_test (index_in):
    print('index_in:', index_in)

    # Craete a database with the schema definition provided
    db_name_ = hub.create_database(schema_def)

    # Generate encodings
    texts = ["Sure, technically these are processes, and this program should really be called a process spawning manager, but this is only due to the way that BASH works when it forks using the ampersand, it uses the fork() or perhaps clone() system call which clones into a separate memory space, rather than something like pthread_create() which would share memory. If BASH supported the latter, each sequence of execution would operate just the same and could be termed to be traditional threads whilst gaining a more efficient memory footprint.",
    "Sure, technically these are processes, and this program should really be called a process spawning manager, but this is only due to the way that BASH works when it forks using the ampersand, it uses the fork() or perhaps clone() system call which clones into a separate memory space, rather than something like pthread_create() which would share memory. If BASH supported the latter, each sequence of execution would operate just the same and could be termed to be traditional threads whilst gaining a more efficient memory footprint.",
    "Sure, technically these are processes, and this program should really be called a process spawning manager, but this is only due to the way that BASH works when it forks using the ampersand, it uses the fork() or perhaps clone() system call which clones into a separate memory space, rather than something like pthread_create() which would share memory. If BASH supported the latter, each sequence of execution would operate just the same and could be termed to be traditional threads whilst gaining a more efficient memory footprint.",
    "Sure, technically these are processes, and this program should really be called a process spawning manager, but this is only due to the way that BASH works when it forks using the ampersand, it uses the fork() or perhaps clone() system call which clones into a separate memory space, rather than something like pthread_create() which would share memory. If BASH supported the latter, each sequence of execution would operate just the same and could be termed to be traditional threads whilst gaining a more efficient memory footprint."]
    compression = hub.compress_documents(db_name_, texts)
    print(len(compression)==len(texts))

# test concurrency
def test_concurrency_thread (counter_upto):
    start = time.time()
    print("starting thread")
    
    pool = mp.Pool(500) #mp.cpu_count())
    pool.map(run_test, range(counter_upto))
    pool.close()
    pool.join()
        
    end = time.time()
    print(end-start, counter_upto)
    start = end

test_concurrency_thread(10000)


# test model downloads from different sources
schema_def["encoder"] = "ftxt:http://0.0.0.0:2000/cc.en.300.bin"
schema_def["codelen"] = 300
print(schema_def)

db_name_ = hub.create_database(schema_def)
print(db_name_)


# test model downloads from different sources
schema_def["encoder"] = "ftxt:ipfs://QmY2FFRuW4xVeCDkwgwkWcq1aHaKFjfbEHPXjEEuQYax4P"
schema_def["codelen"] = 300

db_name_ = hub.create_database(schema_def)
print(db_name_)
