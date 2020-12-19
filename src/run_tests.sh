rm -r /data/*

python3 -m unittest test.apis.db_fns -v
python3 -m unittest test.apis.doc_fns -v
python3 -m unittest test.apis.search_fns -v
python3 -m unittest test.apis.auth_fns -v