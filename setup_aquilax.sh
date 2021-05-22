#!/bin/bash -e

# cleanup
# docker-compose -p "aquilanet"  down

# create aquilax data directory
mkdir -p ${HOME}/aquilax/
mkdir -p ${HOME}/aquilax/src
mkdir -p ${HOME}/aquilax/data
mkdir -p ${HOME}/aquilax/data/models
mkdir -p ${HOME}/aquilax/ossl
mkdir -p ${HOME}/aquilax/nginx
mkdir -p ${HOME}/aquilax/webpage

echo "================================"
echo "==== Downloading Base Model ===="
echo "================================"
wget -c "https://ftxt-models.s3.us-east-2.amazonaws.com/wiki_100d_en.bin" -P ${HOME}/aquilax/data/models/

# setup ossl keys
if ! test -f ${HOME}/aquilax/ossl/private.pem; then
    openssl genrsa -passout pass:1234 -des3 -out ${HOME}/aquilax/ossl/private.pem 2048
fi
if ! test -f ${HOME}/aquilax/ossl/public.pem; then
    openssl rsa -passin pass:1234 -in ${HOME}/aquilax/ossl/private.pem -outform PEM -pubout -out ${HOME}/aquilax/ossl/public.pem
fi
if ! test -f ${HOME}/aquilax/ossl/private_unencrypted.pem; then
    openssl rsa -passin pass:1234 -in ${HOME}/aquilax/ossl/private.pem -out ${HOME}/aquilax/ossl/private_unencrypted.pem -outform PEM
fi

# build aqiladb image
docker build https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/Dockerfile -t aquiladb:local

# build aqilahub image
docker build https://raw.githubusercontent.com/Aquila-Network/AquilaHub/main/Dockerfile -t aquilahub:local

# build aquilax image
docker build https://raw.githubusercontent.com/Aquila-Network/AquilaX-CE/main/Dockerfile -t aquilax:local

# setup X UI and nginx config
cd ${HOME}/aquilax/webpage/
git clone https://github.com/Aquila-Network/search-ux.git .
wget "https://raw.githubusercontent.com/Aquila-Network/AquilaX-CE/main/nginx.conf" -P ${HOME}/aquilax/nginx/

echo ${HOME}/aquilax/ossl

# run docker compose
cd ${HOME}/aquilax/src
wget "https://raw.githubusercontent.com/Aquila-Network/AquilaX-CE/main/docker-compose.yml"
docker-compose -p "aquilanet"  up -d
