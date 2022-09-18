# AquilaX EE

Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `data-source.ts` file
3. Run `yarn run start:dev` command
4. Generate migration `yarn run typeorm -- migration:generate src/migrations/bookmark --dataSource src/config/db.ts`
5. Run migration `yarn run typeorm -- migration:run --dataSource src/config/db.ts`
