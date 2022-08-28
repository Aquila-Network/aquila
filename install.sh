#!/bin/bash -e

export DEBIAN_FRONTEND=noninteractive
apt update

export USER=$(whoami)
export ROOT_DIR=/home/$USER

mkdir -p /data/
mkdir -p $ROOT_DIR
cd $ROOT_DIR

mini=1
gpu=0
test=0
demon=0

while getopts m:g:t:d: flag
do
    case "${flag}" in
        m) mini=${OPTARG};;
        g) gpu=${OPTARG};;
        t) test=${OPTARG};;
        d) demon=${OPTARG};;
    esac
done

if [[ $mini -eq 1 ]]; # if minimal install enabled
then
    echo "Aquila DB minimal install will be done by default. \
    Minimal install is recommended for personal use - \
    install process is fast and lightweight. If you are planning to deal \
    with big-data, disable minimal install with '-m 0' argument"
fi

# system packs install
apt install -y git wget nano python3 python3-pip libssl-dev
if [[ $mini -eq 0 ]]; # if minimal install disabled
then
    apt install -y libblas-dev liblapack-dev swig
fi

# setup venv
pip3 install virtualenv
virtualenv $ROOT_DIR/env
source $ROOT_DIR/env/bin/activate

# install python packages
pip3 install numpy pycryptodome base58 chardet Flask requests flask_cors PyYAML bson fastjsonschema annoy plyvel

if [[ $mini -eq 0 ]]; # if minimal install disabled
then
    # install cmake
    apt purge --auto-remove cmake

    version=3.19
    build=1
    mkdir -p $ROOT_DIR/temp
    cd $ROOT_DIR/temp
    wget https://cmake.org/files/v$version/cmake-$version.$build.tar.gz
    tar -xzvf cmake-$version.$build.tar.gz
    cd cmake-$version.$build/

    ./bootstrap
    make -j$(nproc)
    make install

    cmake --version

    # install faiss
    cd $ROOT_DIR
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

    cp -r $ROOT_DIR/faiss/build/faiss/python/ $ROOT_DIR/env/lib/python3.8/site-packages/faiss
fi

# clone & test AquilaDB
cd $ROOT_DIR
mkdir -p adb
cd adb
git clone https://github.com/Aquila-Network/AquilaDB.git .

mkdir -p /ossl/
openssl genrsa -passout pass:1234 -des3 -out /ossl/private.pem 2048
openssl rsa -passin pass:1234 -in /ossl/private.pem -outform PEM -pubout -out /ossl/public.pem
openssl rsa -passin pass:1234 -in /ossl/private.pem -out /ossl/private_unencrypted.pem -outform PEM

cd $ROOT_DIR/adb/src
if [[ $test -eq 1 ]]; # if tests enabled
then
	chmod +x run_tests.sh
	./run_tests.sh
else
	echo "Not running tests"
fi

echo "==================================="
echo "     AquilaDB setup complete.      "
echo "==================================="

if [[ $demon -eq 1 ]]; # if demon run enabled
then
    # install node
    apt install -y nodejs npm
    # install pm2
    npm i pm2 -g

    # start server
    pm2 start index.py
    # Keep logs alive
    pm2 logs -f
fi
