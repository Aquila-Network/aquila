# start a new build stage
FROM ubuntu:latest as builder

RUN ls

# set work directory
ENV ROOT_DIR /home/root
WORKDIR $ROOT_DIR

# install aquiladb
RUN apt update && apt install -y curl && \
    curl -s -L https://raw.githubusercontent.com/Aquila-Network/AquilaDB/master/install.sh | /bin/bash

# preperations
ENV PATH="$ROOT_DIR/env/bin:$PATH"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# install and start demon
RUN mkdir -p /data && \
    printf "#!/bin/bash\nsource env/bin/activate && export MINI_AQDB='active' && cd adb/src && \
    python3 index.py" > /bin/init.sh && chmod +x /bin/init.sh

# expose port
EXPOSE 5001

ENTRYPOINT ["init.sh"]