FROM node:16-alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

CMD yarn run typeorm -- migration:generate src/migrations/bookmark --dataSource src/config/db.ts && yarn run typeorm -- migration:run --dataSource src/config/db.ts && yarn start