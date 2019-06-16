service couchdb start
cd /aquiladb/src/
node vecdb.js &
node peer_manager.js &
python vecstore.py &