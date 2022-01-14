import logging
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)

import asyncio

from utils import CID, schema

import encoder as enc_

SLEEP_PROTECTION = 0.0001

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

def get_encoder_name (schema_in):
    """
    Get encoder name from schema
    """

    encoder_name = None
    try:
        schema_def = schema.generate_schema(schema_in)
        encoder_name = schema_def["encoder"]
    except Exception as e:
        logging.error(e)

    return encoder_name

class Manager ():
    def __init__(self):
        # to track all database - encoder mappings
        self.db_to_encoders_map = {}
        self.encoders_to_obj_map = {}

    def __del__(self):
        logging.debug("Killed manager")

    def preload_model (self, json_schema):
        """
        Download a model and load it into memory
        """
        # parse schema
        database_name = get_database_name(json_schema)
        encoder_name = get_encoder_name(json_schema)
        
        # load model for database
        if database_name:
            # database already not created?
            if not self.db_to_encoders_map.get(database_name):
                self.db_to_encoders_map[database_name] = encoder_name
                # encoder already not created?
                if not self.encoders_to_obj_map.get(encoder_name):
                    self.encoders_to_obj_map[encoder_name] = enc_.Encoder(encoder_name, asyncio.Queue())
                    # encoder already loaded?
                    if self.encoders_to_obj_map[encoder_name].preload_model(json_schema, database_name):
                        return database_name
                    else:
                        # reset all, don't create DB & encoder
                        self.encoders_to_obj_map[encoder_name] = None
                        self.db_to_encoders_map[database_name] = None
                        return None
                else:
                    return database_name
            else:
                return database_name
        else:
            return None

    async def compress_data (self, database_name, texts):
        """
        Load an already existing database 
        """
        if self.db_to_encoders_map.get(database_name):
            encoder_name = self.db_to_encoders_map[database_name]
            if self.encoders_to_obj_map.get(encoder_name):
                response_ = None
                # add compression request to queue, get request id
                req_id = await self.encoders_to_obj_map[encoder_name].enqueue_compress_data(texts)
                # wait until request id is processed
                while (True):
                    # response available yet?
                    response_ = self.encoders_to_obj_map[encoder_name].response_queue[req_id]
                    if response_ != None:
                        # response available; take it, reset queue & break waiting
                        self.encoders_to_obj_map[encoder_name].response_queue[req_id] = None
                        break
                    # sleep for a while
                    await asyncio.sleep(SLEEP_PROTECTION)
                return response_
            else:
                return None
        else:
            return None

    # write to disk
    def write_to_disk (self):
        pass

    # define background task to process request queue for each database object
    async def background_task(self):
        logging.debug("===== Background task INIT =====")
        while self.bg_task_active:
            # for each database object
            for key_ in self.encoders_to_obj_map:
                # any request available in queue?
                if self.encoders_to_obj_map[key_].request_queue.empty():
                    continue
                # process request
                await self.encoders_to_obj_map[key_].process_queue()
                # Write to Disk # TODO: write to disk all metadata for each database object serially
                self.write_to_disk()

            await asyncio.sleep(SLEEP_PROTECTION)
