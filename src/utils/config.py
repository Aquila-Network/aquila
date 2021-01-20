import yaml
import os

os.environ["DATA_STORE_LOCATION"] = "/data/"

with open("config.yml", "r") as stream:
    DB_config = yaml.safe_load(stream)
    
    if "AUTH_KEY_FILE" not in os.environ:
        os.environ["AUTH_KEY_FILE"] = str(DB_config["auth"]["pubkey"])
