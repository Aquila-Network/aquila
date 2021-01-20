#!/bin/bash -e

export DEBIAN_FRONTEND=noninteractive
apt update

export USER=$(whoami)
export ROOT_DIR=/home/$USER

mkdir -p /data/
mkdir -p $ROOT_DIR
cd $ROOT_DIR

test=0
demon=0

while getopts t:d: flag
do
    case "${flag}" in
        t) test=${OPTARG};;
        d) demon=${OPTARG};;
    esac
done

# system packs install
apt install -y git python3.8 python3-pip libssl-dev wget

# setup venv
pip3 install virtualenv
virtualenv $ROOT_DIR/env
source $ROOT_DIR/env/bin/activate

# setup IPFS
cd $ROOT_DIR
wget https://dist.ipfs.io/go-ipfs/v0.7.0/go-ipfs_v0.7.0_linux-amd64.tar.gz
tar -xvzf go-ipfs_v0.7.0_linux-amd64.tar.gz
cd go-ipfs
./install.sh


# clone & test AquilaDB
cd $ROOT_DIR
mkdir -p ahub
cd ahub
git clone https://github.com/Aquila-Network/AquilaHub.git .

# install python packages
pip3 install -r src/requirements.txt

mkdir -p /ossl/
openssl genrsa -passout pass:1234 -des3 -out /ossl/private.pem 2048
openssl rsa -passin pass:1234 -in /ossl/private.pem -outform PEM -pubout -out /ossl/public.pem
openssl rsa -passin pass:1234 -in /ossl/private.pem -out /ossl/private_unencrypted.pem -outform PEM

cd $ROOT_DIR/ahub/src
if [[ $test -eq 1 ]]; # if tests enabled
then
	chmod +x run_tests.sh
	./run_tests.sh
else
	echo "Not running tests"
fi

echo "=========================================="
echo "      AquilaHub installation complete.     "
echo "=========================================="

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
