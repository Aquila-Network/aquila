# start a new build stage
FROM ubuntu:latest as builder

# set work directory
ENV ROOT_DIR /home/root
WORKDIR $ROOT_DIR

# preperations
ENV PATH="$ROOT_DIR/env/bin:$PATH"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt update && apt install -y git nano python3.8 python3-pip libssl-dev && \
    pip3 install virtualenv

RUN cd $ROOT_DIR && \
    mkdir -p ax && \
    cd ax && \
    git clone https://github.com/Aquila-Network/AquilaX-CE.git . && \
    virtualenv $ROOT_DIR/env && \
    source $ROOT_DIR/env/bin/activate && \
    cd src && pip3 install -r requirements.txt

RUN mkdir -p /ossl/ && \
    openssl genrsa -passout pass:1234 -des3 -out /ossl/private.pem 2048 && \
    openssl rsa -passin pass:1234 -in /ossl/private.pem -outform PEM -pubout -out /ossl/public.pem && \
    openssl rsa -passin pass:1234 -in /ossl/private.pem -out /ossl/private_unencrypted.pem -outform PEM

# install and start demon
RUN mkdir -p /data && \
    printf "#!/bin/bash\nsource env/bin/activate && cd ax/src && \
    python3 index.py" > /bin/init.sh && chmod +x /bin/init.sh

# expose port
EXPOSE 5000

ENTRYPOINT ["init.sh"]