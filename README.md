# AquilaX EE

## ⚠️ Server and other Credentials are in workflow file
Never make this repo Public

Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `data-source.ts` file
3. Run `yarn run start:dev` command
4. Generate migration `yarn run typeorm -- migration:generate src/migrations/bookmark --dataSource src/config/db.ts`
5. Run migration `yarn run typeorm -- migration:run --dataSource src/config/db.ts`


## Run using Docker
Docker build
```bash
docker build -t manekshms/aquila-network-api .

docker run -d -p 5000:5000 \
-e DB_HOST=host.docker.internal \
-e DB_PORT=5432 \
-e DB_NAME=test_db \
-e DB_USERNAME=test \
-e DB_PASSWORD=example \
-e REDIS_HOST=host.docker.internal \
-e REDIS_PORT=6379 \
-e REDIS_USERNAME=default \
-e REDIS_PASSWORD=redis123 \
-e JWT_SECRET=jwtsecret \
-e JWT_EXPIRES_IN=2h \
-e SUMMARIZER_URL=http://host.docker.internal:5008/process \
-e AQUILA_DB_HOST=http://host.docker.internal \
-e AQUILA_DB_PORT=5001 \
-e AQUILA_DB_KEY_PATH=/ossl/private_unencrypted.pem \
-e AQUILA_HUB_HOST=http://host.docker.internal \
-e AQUILA_HUB_PORT=5002 \
-e AQUILA_HUB_KEY_PATH=/ossl/private_unencrypted.pem \
-e ENV BROWSERLESS_API_KEY=b94a8c0c-3b5c-4342-ab2d-a4b19bf1f13b \
-v ${HOME}/aquilax/ossl:/ossl
--name manekshms/aquila-network-ui
```

