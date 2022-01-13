import logging
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)

import asyncio

from utils import CID, schema

import encoder as enc_

SLEEP_PROTECTION = 0.001

def get_database_name (schema_in):
    """
    Get databse name from schema
    """

    database_name = None
    try:
        schema_def = schema.generate_schema(schema_in)
        database_name = CID.doc2CID(schema_def)
    except Exception as e:
        logging.error(e)

    return database_name

class Manager ():
    def __init__(self):
        # to track all database - encoder mappings
        self.encoders_map = {}

    def __del__(self):
        logging.debug("Killed manager")

    def preload_model (self, json_schema):
        """
        Download a model and load it into memory
        """

        database_name = get_database_name(json_schema)
        if database_name:
            if not self.encoders_map.get(database_name):
                self.encoders_map[database_name] = enc_.Encoder(database_name, asyncio.Queue())
                if self.encoders_map[database_name].preload_model(json_schema):
                    return database_name
                else:
                    self.encoders_map[database_name] = None
                    return None
            else:
                return database_name
        else:
            return None

    async def compress_data (self, database_name, texts):
        """
        Load an already existing database 
        """
        if self.encoders_map.get(database_name):
            response_ = None
            # add compression request to queue, get request id
            req_id = await self.encoders_map[database_name].enqueue_compress_data(texts)
            # wait until request id is processed
            while (True):
                # response available yet?
                response_ = self.encoders_map[database_name].response_queue[req_id]
                if response_ != None:
                    # response available; take it, reset queue & break waiting
                    self.encoders_map[database_name].response_queue[req_id] = None
                    break
                # sleep for a while
                await asyncio.sleep(SLEEP_PROTECTION)
            return response_
        else:
            return None

    # define background task to process request queue for each database object
    async def background_task(self):
        logging.debug("===== Background task INIT =====")
        while self.bg_task_active:
            # for each database object
            for key_ in self.encoders_map:
                # any request available in queue?
                if self.encoders_map[key_].request_queue.empty():
                    continue
                # process request
                await self.encoders_map[key_].process_queue()
                # Write to Disk # TODO: write to disk all metadata for each database object serially
                self.encoders_map[key_].write_to_disk()

            await asyncio.sleep(SLEEP_PROTECTION)
