import { InternalServerError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import { In } from "typeorm";

import dataSource from "../config/db";
import { Bookmark, BookmarkStatus } from "../entity/Bookmark";
import { BookmarkPara } from "../entity/BookmarkPara";
import { Collection } from "../entity/Collection";
import { CollectionSubscription } from "../entity/CollectionSubscription";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";
import { AquilaClientService } from "../lib/AquilaClientService";
import { AccountStatus } from "./dto/AuthServiceDto";
import { GetSubscriptionsByCustomerIdOptionsInputDto, GetSubscriptionsByCustomerIdOutputDto } from "./dto/CollectionSubscriptionServiceDto";

@Service()
export class CollectionSubscriptionService {

	public constructor(private aquilaClientService: AquilaClientService) {}

	private async subscribeTemporaryCollection(collectionId: string, customerId: string): Promise<CollectionSubscriptionTemp> {
		let subscription = new CollectionSubscriptionTemp();
		await dataSource.transaction(async transactionalEntityManager => {
			subscription.collectionId = collectionId;
			subscription.subscriberId = customerId;
			await transactionalEntityManager.save(subscription);
		})
		return subscription;
	}
	
	private async subscribePermanentCollection(collectionId: string, customerId: string): Promise<CollectionSubscription> {
		let subscription = new CollectionSubscription();
		await dataSource.transaction(async transactionalEntityManager => {
			subscription.collectionId = collectionId;
			subscription.subscriberId = customerId;
			await transactionalEntityManager.save(subscription);
		})
		return subscription;
	}

	public async subscribeCollection(collectionId: string, customerId: string, accountStatus: AccountStatus): Promise<CollectionSubscription|CollectionSubscriptionTemp> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.subscribeTemporaryCollection(collectionId, customerId);
		}
		return await this.subscribePermanentCollection(collectionId, customerId);
	}

	private async getTemporaryCollectionSubscriptionList(customerId: string): Promise<CollectionSubscriptionTemp[]> {
		const collections = await CollectionSubscriptionTemp.find({ where: { subscriberId: customerId }});
		return collections;
	}
	
	private async getPermanentCollectionSubscriptionList(customerId: string): Promise<CollectionSubscription[]> {
		const collections = await CollectionSubscription.find({ where: { subscriberId: customerId }});
		return collections;
	}

	public async getCustomerSubscriptions(customerId: string, accountStatus: AccountStatus): Promise<CollectionSubscriptionTemp[] | CollectionSubscription[]> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getTemporaryCollectionSubscriptionList(customerId);
		}
		return await this.getPermanentCollectionSubscriptionList(customerId);
	}

	public async isCollectionSubscribedByTemporaryCustomer(collectionId: string, customerId: string): Promise<boolean> {
		// will return null if query can't find a result
		const subscription = await CollectionSubscriptionTemp.findOne({ where: { collectionId, subscriberId: customerId} });

		if(subscription) {
			return true;
		}
	
		return false;
	 }

	public async isCollectionSubscribedByPermanentCustomer(collectionId: string, customerId: string): Promise<boolean> {
		// will return null if query can't find a result
		const subscription = await CollectionSubscription.findOne({ where: { collectionId, subscriberId: customerId} });
		
		if(subscription) {
			return true;
		}
	
		return false;
	 }
	 
	 public async isCollectionSubscribedByCustomer(collectionId: string, customerId: string, accountStatus: AccountStatus): Promise<boolean> {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.isCollectionSubscribedByTemporaryCustomer(collectionId, customerId);
		}

		return await this.isCollectionSubscribedByPermanentCustomer(collectionId, customerId);
	 }

	private async unSubscribeTemporaryCollection(collectionId: string, customerId: string): Promise<CollectionSubscriptionTemp | null> {
		const collection = await CollectionSubscriptionTemp.findOne({ where: { collectionId, subscriberId: customerId }});
		if(!collection) {
			throw new NotFoundError("Subscription not found");
		}
		await collection.remove();
		return collection;
	}
	
	private async unSubscribePermanentCollection(collectionId: string, customerId: string): Promise<CollectionSubscription | null> {
		const collection = await CollectionSubscription.findOne({ where: { collectionId, subscriberId: customerId }});
		if(!collection) {
			throw new NotFoundError("Subscription not found");
		}
		await collection.remove()
		return collection;
	}

	public async unSubscribeCollection(collectionId: string, customerId: string, accountStatus: AccountStatus): Promise<CollectionSubscription | CollectionSubscriptionTemp | null> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.unSubscribeTemporaryCollection(collectionId, customerId);
		}
		return await this.unSubscribePermanentCollection(collectionId, customerId);
	}

	private async getTemporaryCollectionFollowerCount(collectionId: string): Promise<number> {
		const count = await CollectionSubscriptionTemp.count({ where: { collectionId }});
		return count;
	}
	
	private async getPermanentCollectionFollowerCount(collectionId: string): Promise<number> {
		const count = await CollectionSubscription.count({ where: { collectionId }});
		return count;
	}

	public async getCollectionSubscriberCount(collectionId: string, accountStatus: AccountStatus): Promise<number> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getTemporaryCollectionFollowerCount(collectionId);
		}
		return await this.getPermanentCollectionFollowerCount(collectionId);
	}

	public async getTotalCollectionSubscribedByTemporaryCustomer(subscriberId: string): Promise<number> {
		const count = await CollectionSubscriptionTemp.count({ where: { subscriberId }});
		return count;
	}

	public async getTotalCollectionSubscribedByPermanentCustomer(subscriberId: string): Promise<number> {
		const count = await CollectionSubscription.count({ where: { subscriberId }});
		return count;
	} 

	public async getTotalCollectionSubscribedByCustomer(customerId: string, accountStatus: AccountStatus): Promise<number> {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return this.getTotalCollectionSubscribedByTemporaryCustomer(customerId);
		}
		return this.getTotalCollectionSubscribedByPermanentCustomer(customerId);
	}


	private async getAllSubscriptionsByCustomerId(collectionIds: string[], options: GetSubscriptionsByCustomerIdOptionsInputDto): Promise<GetSubscriptionsByCustomerIdOutputDto> {
		const skip = (options.page - 1) * options.limit;
		const take = options.limit;
		const totalRecords = await Bookmark.count({ where: { collectionId: In(collectionIds), status: BookmarkStatus.PROCESSED }});
		const bookmarks = await Bookmark.find({ where: { collectionId: In(collectionIds), status: BookmarkStatus.PROCESSED}, skip, take });
		// find all paragraphs for bookmark
		const bookmarkIds = bookmarks.map(item => item.id);
		const paras = await BookmarkPara.find({ where: { bookmarkId: In(bookmarkIds)}});
		const bookmarkData = bookmarks.map(item => ({
			id: item.id,
			collectionId: item.collectionId,
			url: item.url,
			title: item.title,
			author: item.author,
			coverImg: item.coverImg,
			summary: item.summary,
			description: paras.find(para => para.bookmarkId === item.id)?.content || '',
			createdAt: item.createdAt
		}));
		return {
			totalRecords,
			totalPages: Math.ceil(totalRecords / take),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}	
	}

	public async getSubscriptionsByTemporaryCustomerId(customerId: string, options: GetSubscriptionsByCustomerIdOptionsInputDto): Promise<GetSubscriptionsByCustomerIdOutputDto> {
		const collectionSubscriptions = await CollectionSubscriptionTemp.find({ where: { subscriberId: customerId }});
		const collectionIds = collectionSubscriptions.map(collection => collection.collectionId);
		if(!options.query) {
			return this.getAllSubscriptionsByCustomerId(collectionIds, options);
		}
		const collections = await Collection.find({ where : { id: In(collectionIds)}});

		const documentObjs: any = {};
		for(let i = 0; i < collections.length; i++) {
			const collection = collections[i];
			// generate vector from hub for the search query
			const vector = await this.aquilaClientService.getHubServer().compressDocument(collection.aquilaDbName, [options.query]) as number[][];
			if(vector.length === 0) {
				throw new InternalServerError("Something went wrong");
			}

			// search on aquiladb
			const { docs, dists } = await this.aquilaClientService.getDbServer().searchKDocuments(collection.aquilaDbName, vector, 10)
			const newDists = dists[0];
			docs[0].forEach((doc: any, index: number) => {
				const docExists = documentObjs[doc.metadata.bookmark_id];
				if(!docExists) {
					documentObjs[doc.metadata.bookmark_id] = {
						bookmarkParaId: doc.metadata.bookmark_para_id,
						bookmarkId: doc.metadata.bookmark_id,
						dist:  newDists[index],
						paras: [{ dist: newDists[index], para: doc.metadata.para}]
					}
				}
			});
		}
		const documents = Object.values(documentObjs).sort((a: any, b: any) => (b.dist - a.dist))
		// sort result from aquiladb and select records within limit and offset
		const totalRecords = documents.length;
		const start = (options.page -1) * options.limit;
		const end = ((options.page -1) * options.limit) + options.limit;
		const records = documents.slice(start, end);

		// fetch all bookmarks
		const bookmarkIds = records.map((item: any) => item.bookmarkId);
		const bookmarks = await Bookmark.find({ where: { id: In(bookmarkIds)}});

		// generate result
		const bookmarkData = records.map((item: any) => {
			const bookmark = bookmarks.find(data => data.id === item.bookmarkId) as Bookmark;
			return ({
				id: bookmark.id,
				collectionId: bookmark.collectionId,
				url: bookmark.url,
				title: bookmark.title,
				author: bookmark.author,
				coverImg: bookmark.coverImg,
				summary: bookmark.summary,
				description: item.paras[0].para
			});
		});
		const output = {
			totalRecords,
			totalPages: Math.ceil(totalRecords / options.limit),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}
		return output;
	}

	public async getSubscriptionsByPermanentCustomerId(customerId: string, options: GetSubscriptionsByCustomerIdOptionsInputDto): Promise<GetSubscriptionsByCustomerIdOutputDto> {
		const collectionSubscriptions = await CollectionSubscription.find({ where: { subscriberId: customerId }});
		const collectionIds = collectionSubscriptions.map(collection => collection.collectionId);
		if(!options.query) {
			return this.getAllSubscriptionsByCustomerId(collectionIds, options);
		}
		const collections = await Collection.find({ where : { id: In(collectionIds)}});

		const documentObjs: any = {};
		for(let i = 0; i < collections.length; i++) {
			const collection = collections[i];
			// generate vector from hub for the search query
			const vector = await this.aquilaClientService.getHubServer().compressDocument(collection.aquilaDbName, [options.query]) as number[][];
			if(vector.length === 0) {
				throw new InternalServerError("Something went wrong");
			}

			// search on aquiladb
			const { docs, dists } = await this.aquilaClientService.getDbServer().searchKDocuments(collection.aquilaDbName, vector, 10)
			const newDists = dists[0];
			docs[0].forEach((doc: any, index: number) => {
				const docExists = documentObjs[doc.metadata.bookmark_id];
				if(!docExists) {
					documentObjs[doc.metadata.bookmark_id] = {
						bookmarkParaId: doc.metadata.bookmark_para_id,
						bookmarkId: doc.metadata.bookmark_id,
						dist:  newDists[index],
						paras: [{ dist: newDists[index], para: doc.metadata.para}]
					}
				}
			});
		}
		const documents = Object.values(documentObjs).sort((a: any, b: any) => (b.dist - a.dist))
		// sort result from aquiladb and select records within limit and offset
		const totalRecords = documents.length;
		const start = (options.page -1) * options.limit;
		const end = ((options.page -1) * options.limit) + options.limit;
		const records = documents.slice(start, end);

		// fetch all bookmarks
		const bookmarkIds = records.map((item: any) => item.bookmarkId);
		const bookmarks = await Bookmark.find({ where: { id: In(bookmarkIds)}});

		// generate result
		const bookmarkData = records.map((item: any) => {
			const bookmark = bookmarks.find(data => data.id === item.bookmarkId) as Bookmark;
			return ({
				id: bookmark.id,
				collectionId: bookmark.collectionId,
				url: bookmark.url,
				title: bookmark.title,
				author: bookmark.author,
				coverImg: bookmark.coverImg,
				summary: bookmark.summary,
				description: item.paras[0].para
			});
		});
		const output = {
			totalRecords,
			totalPages: Math.ceil(totalRecords / options.limit),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}
		return output;
	}

	public async getSubscriptionsByCustomerId(customerId: string, options: GetSubscriptionsByCustomerIdOptionsInputDto, accountStatus: AccountStatus): Promise<GetSubscriptionsByCustomerIdOutputDto> {
		if(accountStatus == AccountStatus.TEMPORARY) {
			return this.getSubscriptionsByTemporaryCustomerId(customerId, options);
		}
		return this.getSubscriptionsByPermanentCustomerId(customerId, options);
	}

	public async getCustomerSubscribedCollections(customerId: string, accountStatus: AccountStatus): Promise<Collection[]> {
		let collectionSubscriptions: CollectionSubscription[] | CollectionSubscriptionTemp[];
		if(accountStatus === AccountStatus.TEMPORARY){
			collectionSubscriptions = await CollectionSubscriptionTemp.find({ where: { subscriberId: customerId}});
		}else {
			collectionSubscriptions = await CollectionSubscription.find({ where: { subscriberId: customerId}});
		}
		const collectionIds = collectionSubscriptions.map(item => item.collectionId);
		const collections = await Collection.find({ where: { id: In(collectionIds)}, relations: {customer: true} });
		return collections;
	}

}