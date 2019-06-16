#!/bin/bash

service couchdb start
# /etc/init.d/couchdb start
sleep 5
cd /aquiladb/src/
node vecdb.js &
node peer_manager.js &
python vecstore.py &