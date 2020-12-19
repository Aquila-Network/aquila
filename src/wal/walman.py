import logging

import os
import time
import queue
import threading

LOG_STORE_LOCATION = os.environ["DATA_STORE_LOCATION"] + "/log/"
LOG_CHUNK_LEN = int(os.environ["LOG_CHUNK_LEN"])
PROCESS_TIMEOUT = int(os.environ["THREAD_SLEEP"])
MAX_Q_LEN = int(os.environ["FIXED_Q_LEN"])

process_flag = True
pipeline = None
process_thread = None

# list logs in log directory
log_files_asc = os.listdir(LOG_STORE_LOCATION).sort()

# load last log chunk
last_chunk_name = log_files_asc[-1]
last_chunk_data_len = 0

# read last chunk
with open(LOG_STORE_LOCATION + last_chunk_name) as flog:
    # check if the file is full capacity
    if len(flog.split("\n")) >= LOG_CHUNK_LEN:
        create_new_chunk()
    else:
        last_chunk_data_len = len(flog.split("\n"))

def create_new_chunk ():
    global log_files_asc
    global last_chunk_name
    global last_chunk_data_len

    # name a new log file
    new_f_name = time.time()
    log_files_asc.append(new_f_name)
    last_chunk_name = new_f_name

    # initialize log file
    with open(LOG_STORE_LOCATION + last_chunk_name, "a") as aflog:
        aflog.write("WALOG INIT")
        last_chunk_data_len = 1

def spawn ():
    # spawn worker thread
    global process_flag
    process_flag = True
    # create pipeline to add documents
    global pipeline
    pipeline = queue.Queue(maxsize=MAX_Q_LEN)
    # create process thread
    global process_thread
    process_thread = threading.Thread(target=process, args=(), daemon=True)
    # start process thread
    process_thread.start()

def add_log (batch_in):
    global pipeline
    pipeline.put(batch_in)
    return True

def terminate ():
    global process_flag
    process_flag = False

def process ():
    global pipeline

    while (process_flag):
        time.sleep(PROCESS_TIMEOUT)
        
        # check if queue is not empty
        if not pipeline.empty():
            # fetch all currently available codes from queue
            while not pipeline.empty():
                # pop available logs
                for batch in pipeline.get_nowait():
                    for log_ in batch:
                        # check if the batch length exceeded
                        if last_chunk_data_len + 1 >= LOG_CHUNK_LEN:
                            create_new_chunk()

                        # write log to disk
                        with open(LOG_STORE_LOCATION + last_chunk_name, "a") as aflog:
                            aflog.write("\n" + log_)
