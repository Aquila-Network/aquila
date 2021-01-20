import logging

import os

from urllib import request, parse
from zipfile import ZipFile 


def http_download (url, directory, file_name):
    """
    Download model via http
    """
    try:
        # create models dir, if not exists
        if not os.path.exists(directory):
            os.makedirs(directory)

        original_bin_file_name = url.split("/")[-1].split(".")[0]+".bin"
        # check if model already exists
        if not os.path.exists(directory+file_name+".bin"):
            # if a reusable model available
            if not os.path.exists(directory+original_bin_file_name):
                # download file
                logging.debug("Downloading model..")
                request.urlretrieve(url, directory+file_name+".zip")
                # extract file
                with ZipFile(directory+file_name+".zip", 'r') as zip:
                    logging.debug("Extracting model..")
                    zip.extract(original_bin_file_name, directory)
                # downloaded delete zip file
                os.remove(directory+file_name+".zip")
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
                req =  request.Request("http://127.0.0.1:5001/api/v0/cat?arg="+IPFS_CID)
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
    