![version](https://img.shields.io/github/release-pre/a-mma/AquilaDB.svg) ![license GPL 0.3](https://img.shields.io/github/license/a-mma/AquilaDB.svg) 

![docker build](https://img.shields.io/docker/cloud/automated/ammaorg/aquiladb.svg) ![docker build ststus](https://img.shields.io/docker/cloud/build/ammaorg/aquiladb.svg) ![docker stars](https://img.shields.io/docker/stars/ammaorg/aquiladb.svg) ![docker pulls](https://img.shields.io/docker/pulls/ammaorg/aquiladb.svg) 

![github open issues](https://img.shields.io/github/issues-raw/a-mma/AquilaDB.svg) ![github closed issues](https://img.shields.io/github/issues-closed-raw/a-mma/AquilaDB.svg) ![github stars](https://img.shields.io/github/stars/a-mma/AquilaDB.svg?style=social) 

# AquilaDB
**AquilaDB** is a **Resillient**, **Replicated**, **Decentralized**, **Host neutral** storage for **Feature Vectors** along with **Document Metadata**. Do **k-NN** retrieval from anywhere, even from the darkest rifts of Aquila (in progress). It is easy to setup and scales as the universe expands.

[https://github.com/a-mma/AquilaDB](https://github.com/a-mma/AquilaDB)

![constellation](http://astronomyonline.org/Observation/Images/Constellations/ConstellationBig/Aquila.gif)

#### Resillient
Make sure your data is always available anywhere through any network. It is not necessory to be always online. Work offline, sync later.

#### Replicated
Your data is replicated over nodes to attain eventual consistancy. 

#### Decentralized
There is no single point of failure.

#### Host Neutral
Want to use AWS, Azure, G-cloud or whatever? Or even a legion of laptops? Connect them together? No worries as long as they can talk each other.

# Who is this for
* If you are working on a data science project and need to store a hell lot of data and retrieve similar data based on some feature vector, this will be a useful tool to you, with extra benefits a real world web application needs.
* Are you dealing with a lot of images and related metadata? Want to find the similar ones? You are at the right place.
* If you are looking for a document database, this is not the right place for you.

# Technology
AquilaDB is not built from scratch. Thanks to OSS community, it is based on a couple of cool open source projects out there. We took a couch and added some wheels and jetpacks to make it a super cool butt rest for Data Science Engineers. While **CouchDB** provides us network and scalability benefits, **FAISS** provides superfast similarity search. Along with our peer management service, AquilaDB provides a unique solution.

# Prerequisites
You need `docker` installed.

# Usage
#### Option 1: build from source
* clone this repository
* build image: `docker build -t ammaorg/aquiladb:latest .`
#### Option 2: pull from dockerhub
* pull image: `docker pull ammaorg/aquiladb:latest`
#### Finally, deploy
* deploy: `docker run -d -i -p 50051:50051 -t ammaorg/aquiladb:latest`

# Test
To test this, you need some knowledge of `GRPC`. 
Protocolbuff [API reference](https://github.com/a-mma/AquilaDB/blob/master/src/proto/vecdb.proto).
[Example usage](https://github.com/a-mma/AquilaDB/blob/master/src/test/client.js) of APIs in node js. 

# Progress
This project is still under active development (pre-release). It can be used as a standalone database now. Peer manager is a work in progress, so networking capabilities are not available now. With release v1.0 we will release pre-optimized version of AquilaDB.

# License
GNU General Public License v3.0 [license file](https://github.com/a-mma/AquilaDB/blob/master/LICENSE)

created with ❤️ a-mma.indic (a_മ്മ)
