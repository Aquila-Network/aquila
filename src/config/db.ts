import { DataSource, DataSourceOptions } from "typeorm";

import { ConfigService } from "../lib/ConfigService";

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
		type: 'postgres',
		host: configService.get('DB_HOST'),
		port: parseInt(configService.get('DB_PORT'), 10),
		username: configService.get('DB_USERNAME'),
		password: configService.get('DB_PASSWORD'),
		database: configService.get('DB_NAME'),
		synchronize: false,
		entities: [`${__dirname}/../entity/**/*.{ts,js}`],
		migrations: [`${__dirname}/../migrations/**/*.{ts,js}`],
		migrationsTableName: "migrations",
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;