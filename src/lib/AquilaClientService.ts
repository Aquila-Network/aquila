import { AquilaClient, Db, Hub, Schema, Wallet } from "aquila-js";
import path from "path";
import { Service } from "typedi";
import crypto from 'crypto';

@Service()
export class AquilaClientService {
	private db: Db;
	private hub: Hub;

	public async connect() {
		const wallet = new Wallet( path.join(__dirname, '../../private_unencrypted.pem'));
		const dbUrl = 'http://localhost';
		const dbPort = 5001;
		const hubWallet = new Wallet( path.join(__dirname, '../../private_unencrypted_hub.pem'));
		const hubUrl = 'http://localhost';
		const hubPort = 5002;

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
				encoder: "ftxt:https://x.aquila.network/fasttext/en_10d.bin",
				codelen: 10,
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