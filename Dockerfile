FROM ubuntu:18.04
MAINTAINER a_mma

# install couchdb
RUN apt-get update; apt-get install -y curl; apt-get install -y git
RUN echo "deb https://apache.bintray.com/couchdb-deb bionic main" \
    | tee -a /etc/apt/sources.list
RUN apt-get install -y gnupg
RUN curl -L https://couchdb.apache.org/repo/bintray-pubkey.asc \
    | apt-key add -
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y couchdb

# clone aquiladb src
RUN mkdir aquiladb && cd aquiladb && git clone https://github.com/a-mma/AquilaDB.git .

# setup node environment
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt install -y nodejs
RUN apt-get install -y make
RUN cd aquiladb/src && rm package-lock.json || true && npm install

# setup python environment
RUN python3 --version
RUN apt-get -y install python3-pip
RUN apt-get install -y wget
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh && \
    ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc
ENV PATH /opt/conda/bin:$PATH
RUN conda create -n myenv python && conda install faiss-cpu -c pytorch
RUN python -m pip install grpcio-tools

RUN chmod +x /aquiladb/src/init_aquila_db.sh
CMD /aquiladb/src/init_aquila_db.sh && tail -f /dev/null