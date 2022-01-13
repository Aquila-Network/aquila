import logging

import os
import time

import requests
from tqdm import tqdm

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

def download_large_file (url, location, method="get"):
    r = None
    if method == "get":
        r = requests.get(url, stream=True)
    if method == "post":
        r = requests.post(url, stream=True)

    if r != None:
        r.raise_for_status()
        total_size_in_bytes= int(r.headers.get('content-length', 0))
        block_size = 1024*5
        progress_bar = tqdm(total=total_size_in_bytes, unit='iB', unit_scale=True)
        with open(location, 'wb') as f:
            for chunk in r.iter_content(chunk_size=block_size):
                progress_bar.update(len(chunk))
                f.write(chunk)

        r.close()
        progress_bar.close()
        if total_size_in_bytes != 0 and progress_bar.n != total_size_in_bytes:
            logging.error("Download failed.")
            os.remove(location)
            return False
        return True

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
            status = True
            # if a reusable model available
            if not os.path.exists(directory+original_bin_file_name):
                # download file
                logging.debug("Downloading model..")
                # download from given url
                status = download_large_file(url, directory+original_bin_file_name)
            # failed??
            if not status:
                return None
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
            status = True
            # if a reusable model available
            if not os.path.exists(directory+original_bin_file_name):
                # download file
                logging.debug("Downloading model..")
                logging.debug("Connecting to local IPFS demon..")
                # download from IPFS local API
                url_ = os.environ["IPFS_GATEWAY"]+"/ipfs/"+IPFS_CID
                status = download_large_file(url_, directory+original_bin_file_name)
            # failed??
            if not status:
                return None
            # copy and rename model
            logging.debug("Copy model..")
            os.symlink(directory+original_bin_file_name, directory+file_name+".bin")
    except Exception as e:
        logging.error(e)
        return None
    
    return directory+file_name+".bin"
    