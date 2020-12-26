FROM ubuntu:latest

RUN apt update && apt install -y curl && curl -s -L https://gist.githubusercontent.com/freakeinstein/52694e6c30cb120e4b9325eab02a1bc7/raw/35869c7da5da9a1e0a8835c9de6e25ec7fa31c66/ADB3 | /bin/bash

EXPOSE 5000

CMD ["source /root/env/bin/activate && cd /root/adb/src && pm2 start index.py && pm2 logs -f"]