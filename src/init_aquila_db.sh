service couchdb start
node vecdb.js &
node peer_manager.js &
python vecstore.py &