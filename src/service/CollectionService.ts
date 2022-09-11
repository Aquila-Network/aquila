import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { AquilaClientService } from "../lib/AquilaClientService";
import { AccountStatus } from "./dto/AuthServiceDto";

@Service()
export class CollectionService {

	public constructor(private aquilaClientService: AquilaClientService) {}

	private async getTempCustomerCollectionsByCustomerId(customerId: string): Promise<CollectionTemp[]> {
		const collections = await CollectionTemp.find({ where: { customerId }});
		return collections;
	}

	private async getPermanentCustomerCollectionsByCustomerId(customerId: string): Promise<Collection[]> {
		const collections = await Collection.find({ where: { customerId }});
		return collections;
	}

	public async getCustomerCollectionsByCustomerId(customerId: string, accountStatus: AccountStatus) {
		if(accountStatus === AccountStatus.PERMANENT) {
			return await this.getPermanentCustomerCollectionsByCustomerId(customerId);
		}
		return await this.getTempCustomerCollectionsByCustomerId(customerId);
	}
	
	private async getTemporaryCollectionDocumentsByCollectionId(collectionId: string) {
		// get aquila db collection name	
		const collection = await CollectionTemp.findOne({ where: { id: collectionId }});
		if(!collection) {
			throw new BadRequestError('Collection not found');
		}
		const matrix: number[][] = [[]];
		const documents = this.aquilaClientService.getDbServer().searchKDocuments(collection.aquilaDbName, matrix, 10 );
		return documents;	
	}

	private async getPermanentCollectionDocumentsByCollectionId(collectionId: string) {
		// get aquila db collection name	
		const collection = await Collection.findOne({ where: { id: collectionId }});
		if(!collection) {
			throw new BadRequestError('Collection not found');
		}
		const matrix: number[][] = [[]];
		const documents = this.aquilaClientService.getDbServer().searchKDocuments(collection.aquilaDbName, matrix, 10 );
		return documents;
	}

	public async getCollectionDocumentsByCollectionId(collectionId: string, accountStatus: AccountStatus) {
		if(accountStatus === AccountStatus.PERMANENT) {
			return await this.getPermanentCollectionDocumentsByCollectionId(collectionId);
		}
		return await this.getTemporaryCollectionDocumentsByCollectionId(collectionId);
	}

	private async createNewTemporaryCollection(data: CreateCollectionDto) {
		
	}

	private async createNewPermanentCollection(data: CreateCollectionDto) {

	}

	public async createNewCollection(data: CreateCollectionDto, accountStatus: AccountStatus) {
		if(accountStatus === AccountStatus.PERMANENT) {
			return await this.createNewPermanentCollection(data);
		}
		return await this.createNewTemporaryCollection(data);
	}

}