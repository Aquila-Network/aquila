import logging

import os
import sys
import time

from urllib import request, parse

def reporthook(count, block_size, total_size):
    global start_time
    if count == 0:
        start_time = time.time()
        return
    duration = time.time() - start_time
    progress_size = int(count * block_size)
    speed = int(progress_size / (1024 * duration))
    percent = min(int(count*block_size*100/total_size),100)
    logging.debug("\r...%d%%, %d MB, %d KB/s" %
                    (percent, progress_size / (1024 * 1024), speed))


def http_download (url, directory, file_name):
    """
    Download model via http
    """
    try:
        # create models dir, if not exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        original_bin_file_name = url.split("/")[-1]
        # check if model already exists
        if not os.path.exists(directory+file_name+".bin"):
            # if a reusable model available
            if not os.path.exists(directory+original_bin_file_name):
                # download file
                logging.debug("Downloading model..")
                request.urlretrieve(url, original_bin_file_name, reporthook)
            # copy and rename model
            logging.debug("Copy model..")
            os.symlink(directory+original_bin_file_name, directory+file_name+".bin")
    except Exception as e:
        logging.error(e)
        return None

    return directory+file_name+".bin"

def ipfs_download (url, directory, file_name):
    """
    Download model via IPFS
    """
    try:
        # create models dir, if not exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        IPFS_CID = url.split("ipfs://")[1]
        original_bin_file_name = IPFS_CID+".bin"
        # check if model already exists
        if not os.path.exists(directory+file_name+".bin"):
            # if a reusable model available
            if not os.path.exists(directory+original_bin_file_name):
                # download file
                logging.debug("Downloading model..")
                logging.debug("Connecting to local IPFS demon..")
                
                data = parse.urlencode({}).encode()
                req =  request.Request(os.environ["IPFS_API"]+"/v0/cat?arg="+IPFS_CID)
                resp = request.urlopen(req, data=data)
                # write bin file
                with open(directory+original_bin_file_name, 'wb') as file_:
                    file_.write(resp.read())

            # copy and rename model
            logging.debug("Copy model..")
            os.symlink(directory+original_bin_file_name, directory+file_name+".bin")
    except Exception as e:
        logging.error(e)
        return None
    
    return directory+file_name+".bin"
    