# start a new build stage
FROM ubuntu:latest as builder

# set work directory
ENV ROOT_DIR /home/root
WORKDIR $ROOT_DIR

# install aquiladb
RUN apt update && apt install -y curl && \
    curl -s -L https://raw.githubusercontent.com/Aquila-Network/AquilaHub/master/install.sh | /bin/bash


# start a new runner stage
FROM ubuntu:latest as runner

# set work directory
ENV ROOT_DIR /home/root
WORKDIR $ROOT_DIR

RUN echo "$ROOT_DIR"

# copy required files from builder stage
COPY --from=builder $ROOT_DIR/env $ROOT_DIR/env
COPY --from=builder $ROOT_DIR/ahub $ROOT_DIR/ahub
COPY --from=builder /ossl /ossl
COPY --from=builder $ROOT_DIR/go-ipfs $ROOT_DIR/go-ipfs

# preperations
ENV PATH="$ROOT_DIR/env/bin:$PATH"
WORKDIR $ROOT_DIR
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# install IPFS
./go-ipfs/install.sh

# install and start demon
RUN export DEBIAN_FRONTEND=noninteractive && mkdir -p /data && apt update && \
    apt install -y python3 && \
    printf "#!/bin/bash\nsource env/bin/activate && cd ahub/src && \
    python3 index.py" > /bin/init.sh && chmod +x /bin/init.sh

# expose port
EXPOSE 5001

ENTRYPOINT ["init.sh"]
