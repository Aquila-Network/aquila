service couchdb start
sleep 5
cd /aquiladb/src/
node vecdb.js &
node peer_manager.js &
python vecstore.py &