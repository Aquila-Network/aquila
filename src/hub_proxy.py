from sentence_transformers import SentenceTransformer

tr_model = SentenceTransformer('msmarco-distilbert-base-tas-b')

def compress_documents (dbname, text_array):
    return tr_model.encode(text_array).tolist()