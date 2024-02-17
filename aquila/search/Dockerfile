FROM node:16-alpine as builder

# Browserless
ARG BROWSERLESS_API_KEY=your-api-key-here

WORKDIR /app

RUN apk add curl bash
RUN apk add --no-cache git openssh


# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

COPY . .

RUN yarn

RUN yarn build


RUN npm prune --production

# run node prune
RUN /usr/local/bin/node-prune

FROM node:16-alpine

# Application Port
ENV PORT=5000

# Database
ENV DB_HOST=host.docker.internal
ENV DB_PORT=5432
ENV DB_NAME=test_db
ENV DB_USERNAME=user
ENV DB_PASSWORD=password

# Redis
ENV REDIS_HOST=redis-19166.c62.us-east-1-4.ec2.cloud.redislabs.com
ENV REDIS_PORT=19166
ENV REDIS_USERNAME=default
ENV REDIS_PASSWORD=WUFOqcuORH4VoVNKBmzPIQvwsmpHqE5a

# Jwt
ENV JWT_SECRET=jwtsecret
ENV JWT_EXPIRES_IN=2h

#Summarizer
ENV SUMMARIZER_URL=http://host.docker.internal:5008/process

#Aquila
ENV AQUILA_DB_HOST=http://host.docker.internal
ENV AQUILA_DB_PORT=5001
ENV AQUILA_DB_KEY_PATH=../../private_unencrypted.pem
ENV AQUILA_HUB_HOST=http://host.docker.internal
ENV AQUILA_HUB_PORT=5002
ENV AQUILA_HUB_KEY_PATH=../../private_unencrypted_hub.pem

# Browserless
ENV BROWSERLESS_API_KEY=b94a8c0c-3b5c-4342-ab2d-a4b19bf1f13b

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD ["node", "./dist/index.js"]