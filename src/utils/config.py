import yaml
import os

os.environ["DATA_STORE_LOCATION"] = "/data/"
os.environ["LOG_CHUNK_LEN"] = "1000"

with open("DB_config.yml", "r") as stream:
    DB_config = yaml.safe_load(stream)
    
    if "AUTH_KEY_FILE" not in os.environ:
        os.environ["AUTH_KEY_FILE"] = str(DB_config["auth"]["pubkey"])
    
    if "FIXED_VEC_DIMENSION" not in os.environ:
        os.environ["FIXED_VEC_DIMENSION"] = str(DB_config["docs"]["vd"])

    if "MIN_SAWP_COUNT" not in os.environ:
        os.environ["MIN_SAWP_COUNT"] = str(DB_config["docs"]["cswap"])
    
    if "FIXED_Q_LEN" not in os.environ:
        os.environ["FIXED_Q_LEN"] = str(DB_config["queue"]["qlen"])

    if "THREAD_SLEEP" not in os.environ:
        os.environ["THREAD_SLEEP"] = str(DB_config["queue"]["sleep"])

    if "FAISS_MAX_CELLS" not in os.environ:
        os.environ["FAISS_MAX_CELLS"] = str(DB_config["faiss"]["init"]["nlist"])

    if "FAISS_VISIT_CELLS" not in os.environ:
        os.environ["FAISS_VISIT_CELLS"] = str(DB_config["faiss"]["init"]["nprobe"])

    if "FAISS_BYTES_PER_VEC" not in os.environ:
        os.environ["FAISS_BYTES_PER_VEC"] = str(DB_config["faiss"]["init"]["bpv"])

    if "FAISS_BYTES_PER_SUB_VEC" not in os.environ:
        os.environ["FAISS_BYTES_PER_SUB_VEC"] = str(DB_config["faiss"]["init"]["bpsv"])

    if "ANNOY_SIM_METRIC" not in os.environ:
        os.environ["ANNOY_SIM_METRIC"] = str(DB_config["annoy"]["init"]["smetric"])

    if "ANNOY_NTREES" not in os.environ:
        os.environ["ANNOY_NTREES"] = str(DB_config["annoy"]["init"]["ntrees"])

    if "ANNOY_SK" not in os.environ:
        os.environ["ANNOY_SK"] = str(DB_config["annoy"]["init"]["search_k"])