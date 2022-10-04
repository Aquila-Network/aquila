import { NotFoundError } from "routing-controllers";
import { Service } from "typedi";

import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { AccountStatus } from "./dto/AuthServiceDto";
import { GetAllCollectionsInputOptionsDto, GetAllCollectionsOutputDto } from "./dto/CollectionServiceDto";

@Service()
export class CollectionService {

	public constructor() {}

	private async getAllTemporaryCollections(options: GetAllCollectionsInputOptionsDto): Promise<GetAllCollectionsOutputDto> {
		const allowedWhere: ['isShareable', 'isFeatured'] = ['isShareable', 'isFeatured'];

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

	public async getAllPermanentCollections(options: GetAllCollectionsInputOptionsDto): Promise<GetAllCollectionsOutputDto> {
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

	public async getAllCollections(options: GetAllCollectionsInputOptionsDto, accountStatus: AccountStatus): Promise<GetAllCollectionsOutputDto> {
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

	public async getCustomerCollectionsByCustomerId(customerId: string, accountStatus: AccountStatus): Promise<Collection[]|CollectionTemp[]> {
		if(accountStatus === AccountStatus.PERMANENT) {
			return await this.getPermanentCustomerCollectionsByCustomerId(customerId);
		}
		return await this.getTempCustomerCollectionsByCustomerId(customerId);
	}
	
	public async getTemporaryCollectionById(id: string): Promise<CollectionTemp> {
		const collection = await CollectionTemp.findOne({ where: { id } });
		if(!collection) {
			throw new NotFoundError("Collection Not found");
		}
		return collection;
	}

	public async getPermanentCollectionById(id: string): Promise<Collection> {
		const collection = await Collection.findOne({ where: { id }});
		if(!collection) {
			throw new NotFoundError("Collection not found");
		}
		return collection;
	}

	public async getCollectionById(id: string, accountStatus: AccountStatus): Promise<Collection|CollectionTemp> {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getTemporaryCollectionById(id);
		}	
		return await this.getPermanentCollectionById(id)
	}

	public async getPublicCollectionById(id: string): Promise<Collection> {
		const collection = await Collection.findOne({ where: { id, isShareable: true }});
		if(!collection) {
			throw new NotFoundError("Collection not found");
		}
		return collection;
	}

}