# start a new build stage
FROM ubuntu:latest as builder

# set work directory
ENV ROOT_DIR /home/root
WORKDIR $ROOT_DIR

# preperations
ENV PATH="$ROOT_DIR/env/bin:$PATH"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt update && apt install -y git nano python3.8 python3-pip libssl-dev && \
    pip3 install virtualenv && \
    virtualenv $ROOT_DIR/env && \
    source $ROOT_DIR/env/bin/activate && \
    pip3 install requirements.txt

RUN cd $ROOT_DIR && \
    mkdir -p ahub && \
    cd ahub && \
    git clone https://github.com/Aquila-Network/AquilaHub.git .

RUN mkdir -p /ossl/ && \
    openssl genrsa -passout pass:1234 -des3 -out /ossl/private.pem 2048 && \
    openssl rsa -passin pass:1234 -in /ossl/private.pem -outform PEM -pubout -out /ossl/public.pem && \
    openssl rsa -passin pass:1234 -in /ossl/private.pem -out /ossl/private_unencrypted.pem -outform PEM

# install and start demon
RUN mkdir -p /data && \
    printf "#!/bin/bash\nsource env/bin/activate && cd ahub/src && \
    python3 index.py" > /bin/init.sh && chmod +x /bin/init.sh

# expose port
EXPOSE 5002

ENTRYPOINT ["init.sh"]