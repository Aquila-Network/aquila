import { AquilaClient, Db, Hub, Schema, Wallet } from "aquila-js";
import path from "path";
import { Service } from "typedi";
import crypto from 'crypto';
import { ConfigService } from "./ConfigService";

@Service()
export class AquilaClientService {
	private db: Db;
	private hub: Hub;

	public constructor(private configService: ConfigService) {}

	public async connect() {
		const wallet = new Wallet( path.join(this.configService.get("AQUILA_DB_KEY_PATH")));
		const dbUrl = this.configService.get("AQUILA_DB_HOST");
		const dbPort = parseInt(this.configService.get("AQUILA_DB_PORT"), 10);
		const hubWallet = new Wallet( path.join(this.configService.get("AQUILA_HUB_KEY_PATH")));
		const hubUrl = this.configService.get("AQUILA_HUB_HOST");
		const hubPort = parseInt(this.configService.get("AQUILA_HUB_PORT"), 10);

		// connecting to aquila db server
		this.db = await AquilaClient.getDbServer(dbUrl, dbPort, wallet);
		// connecting to aquila hub server
		this.hub = await AquilaClient.getHubServer(hubUrl, hubPort, hubWallet);
	}

	public getDbServer() {
		return this.db;
	}

	public getHubServer() {
		return this.hub;
	}

	public async createCollection(desc: string, secretKey: string) {
		const hashSecret = crypto.createHash('sha256');
			const schema: Schema = {
				description: desc,
				unique: hashSecret.update(secretKey).digest('hex'),
				encoder: "strn:msmarco-distilbert-base-tas-b",
				codelen: 768,
				metadata: {
						"para": "string",
						"bookmark_para_id": "string",
						"bookmark_id": "string"
				}
			};
		await this.hub.createDatabase(schema);
		const dbName = await this.db.createDatabase(schema);
		return dbName;
	}

}