import { Service } from "typedi";

import dataSource from "../config/db";
import { CollectionSubscription } from "../entity/CollectionSubscription";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";
import { AccountStatus } from "./dto/AuthServiceDto";

@Service()
export class CollectionSubscriptionService {

	public constructor() {}

	private async addTemporaryCollectionSubscription(collectionId: string, customerId: string): Promise<CollectionSubscriptionTemp> {
		let subscription = new CollectionSubscriptionTemp();
		await dataSource.transaction(async transactionalEntityManager => {
			subscription.collectionId = collectionId;
			subscription.subscriberId = customerId;
			await transactionalEntityManager.save(subscription);
		})
		return subscription;
	}
	
	private async addPermanentCollectionSubscription(collectionId: string, customerId: string): Promise<CollectionSubscription> {
		let subscription = new CollectionSubscription();
		await dataSource.transaction(async transactionalEntityManager => {
			subscription.collectionId = collectionId;
			subscription.subscriberId = customerId;
			await transactionalEntityManager.save(subscription);
		})
		return subscription;
	}

	public async addCollectionSubscription(collectionId: string, customerId: string, accountStatus: AccountStatus): Promise<CollectionSubscription|CollectionSubscriptionTemp> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.addTemporaryCollectionSubscription(collectionId, customerId);
		}
		return await this.addPermanentCollectionSubscription(collectionId, customerId);
	}

	private async getTemporaryCollectionSubscriptionList(customerId: string): Promise<CollectionSubscriptionTemp[]> {
		const collections = await CollectionSubscriptionTemp.find({ where: { subscriberId: customerId }});
		return collections;
	}
	
	private async getPermanentCollectionSubscriptionList(customerId: string): Promise<CollectionSubscription[]> {
		const collections = await CollectionSubscription.find({ where: { subscriberId: customerId }});
		return collections;
	}

	public async getCollectionSubscriptionList(customerId: string, accountStatus: AccountStatus): Promise<CollectionSubscriptionTemp[] | CollectionSubscription[]> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getTemporaryCollectionSubscriptionList(customerId);
		}
		return await this.getPermanentCollectionSubscriptionList(customerId);
	}

	private async getTemporaryCustomerCollectionSubscription(collectionId: string, customerId: string): Promise<CollectionSubscriptionTemp | null> {
		const collection = await CollectionSubscriptionTemp.findOne({ where: { collectionId, subscriberId: customerId }});
		return collection;
	}
	
	private async getPermanentCustomerCollectionSubscription(collectionId: string, customerId: string): Promise<CollectionSubscription | null> {
		const collection = await CollectionSubscription.findOne({ where: { collectionId, subscriberId: customerId }});
		return collection;
	}

	public async getCollectionSubscription(collectionId: string, customerId: string, accountStatus: AccountStatus): Promise<CollectionSubscriptionTemp | CollectionSubscription | null> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getTemporaryCustomerCollectionSubscription(collectionId, customerId);
		}
		return await this.getPermanentCustomerCollectionSubscription(collectionId, customerId);
	}

	private async removeTemporaryCustomerCollectionSubscription(collectionId: string, customerId: string): Promise<void> {
		const collection = await CollectionSubscriptionTemp.findOne({ where: { collectionId, subscriberId: customerId }});
		return await dataSource.transaction(async transactionalEntityManager => {
			transactionalEntityManager.remove(collection);
		});
	}
	
	private async removePermanentCustomerCollectionSubscription(collectionId: string, customerId: string): Promise<void> {
		const collection = await CollectionSubscription.findOne({ where: { collectionId, subscriberId: customerId }});
		return await dataSource.transaction(async transactionalEntityManager => {
			transactionalEntityManager.remove(collection);
		});
	}

	public async removeCollectionSubscription(collectionId: string, customerId: string, accountStatus: AccountStatus): Promise<void> {
		
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.removeTemporaryCustomerCollectionSubscription(collectionId, customerId);
		}
		return await this.removePermanentCustomerCollectionSubscription(collectionId, customerId);
	}

}