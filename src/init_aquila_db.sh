#!/bin/bash

# start couchdb service
service couchdb start

# wait for couchdb to start
sleep 5

# start micro services
cd /aquiladb/src/
pm2 start vecdb.js
pm2 start peer_manager.js
pm2 start vecstore.py