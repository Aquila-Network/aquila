import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { AquilaClientService } from "../lib/AquilaClientService";
import { AccountStatus } from "./dto/AuthServiceDto";
import { CreateCollectionDto, GetAllCollectionsInputOptionsDto, getAllCollectionsOutputDto } from "./dto/CollectionServiceDto";

@Service()
export class CollectionService {

	public constructor(private aquilaClientService: AquilaClientService) {}

	private async getAllTemporaryCollections(options: GetAllCollectionsInputOptionsDto): Promise<getAllCollectionsOutputDto> {
		const allowedWhere: ['isShareable'] = ['isShareable'];
		const where = allowedWhere.reduce((prev: {[key: string]: string | boolean}, current) =>{
			if(options.where && current in options.where) {
				prev[current] = options.where[current] as boolean | string;
			}
			return prev;
		}, {})
		const totalRecords = await CollectionTemp.count({ where });
		const skip = (options.page - 1) * options.limit;
		const take = options.limit;
		const collections = await CollectionTemp.find({ where, take, skip});
		return {
			totalRecords,
			totalPages: Math.ceil(totalRecords / options.limit),
			currentPage: options.page,
			limit: options.limit,
			collections
		};
	}

	public async getAllPermanentCollections(options: GetAllCollectionsInputOptionsDto) {
		const allowedWhere: ['isShareable'] = ['isShareable'];
		const where = allowedWhere.reduce((prev: {[key: string]: string | boolean}, current) =>{
			if(options.where && current in options.where) {
				prev[current] = options.where[current] as boolean | string;
			}
			return prev;
		}, {})
		const totalRecords = await Collection.count({ where });
		const skip = (options.page - 1) * options.limit;
		const take = options.limit;
		const collections = await Collection.find({ where, take, skip});
		return {
			totalRecords,
			totalPages: Math.ceil(totalRecords / options.limit),
			currentPage: options.page,
			limit: options.limit,
			collections
		};
	}

	public async getAllCollections(options: GetAllCollectionsInputOptionsDto, accountStatus: AccountStatus) {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getAllTemporaryCollections(options);
		}
		return await this.getAllPermanentCollections(options);
	}

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