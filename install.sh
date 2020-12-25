#!/bin/bash -e

# To install from web: apt update && apt install -y curl && curl -s https://gist.githubusercontent.com/freakeinstein/8d39f4e433925753a76922f69af09461/raw/a48b3674c79c205ca187127fb7e128d13fbbb32d/adb_install.sh | bash

export DEBIAN_FRONTEND=noninteractive
apt update

mkdir -p /data/
cd ~

gpu=0
test=0
logs=0

while getopts g:t:l: flag
do
    case "${flag}" in
        g) gpu=${OPTARG};;
        t) test=${OPTARG};;
        l) logs=${OPTARG};;
    esac
done

# system packs install
apt install -y git wget nano python3.8 python3-pip libblas-dev liblapack-dev swig libssl-dev nodejs npm

# setup venv
pip3 install virtualenv
virtualenv env
source ./env/bin/activate

# install python packages
pip3 install numpy pycryptodome base58 chardet Flask requests flask_cors PyYAML bson fastjsonschema annoy plyvel

# install pm2
npm i pm2 -g

# install cmake
apt purge --auto-remove cmake

version=3.19
build=1
mkdir -p ~/temp
cd ~/temp
wget https://cmake.org/files/v$version/cmake-$version.$build.tar.gz
tar -xzvf cmake-$version.$build.tar.gz
cd cmake-$version.$build/

./bootstrap
make -j$(nproc)
make install

cmake --version

# install faiss
cd ~
mkdir -p faiss
cd faiss
git clone https://github.com/facebookresearch/faiss.git .

if [[ $gpu -eq 0 ]]; # if gpu not enabled
then
        echo "build FAISS without GPU"
        cmake -DFAISS_ENABLE_GPU=OFF -B build .
else
        echo "build FAISS with GPU"
        cmake -B build .
fi
make -C build

# For the Python interface:
cd build/faiss/python
python setup.py install

cp -r ~/faiss/build/faiss/python/ /root/env/lib/python3.8/site-packages/faiss

# clone & test AquilaDB
cd ~
mkdir -p adb
cd adb
git clone https://github.com/Aquila-Network/AquilaDB.git .

mkdir -p /ossl/
openssl genrsa -passout pass:1234 -des3 -out /ossl/private.pem 2048
openssl rsa -passin pass:1234 -in /ossl/private.pem -outform PEM -pubout -out /ossl/public.pem
openssl rsa -passin pass:1234 -in /ossl/private.pem -out /ossl/private_unencrypted.pem -outform PEM

cd ~/adb/src
if [[ $test -eq 1 ]]; # if tests enabled
then
	chmod +x run_tests.sh
	./run_tests.sh
else
	echo "Not running tests"
fi

# start server
pm2 start index.py

echo "=========================================="
echo "      AquilaDB installation complete.     "
echo "=========================================="

if [[ $logs -eq 1 ]]; # if demon run enabled
then
    # Keep logs alive
    pm2 logs -f
fi
