#!/bin/bash

# start couchdb service
service couchdb start

# wait for couchdb to start
sleep 5

# start micro services
# with PM2 process manager
cd /AquilaDB/src/
pm2 start vecdb.js
pm2 start peer_manager.js
pm2 start vecstore.py
