import { Service } from "typedi";

import dataSource from "../config/db";
import { CollectionSubscription } from "../entity/CollectionSubscription";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";
import { AccountStatus } from "./dto/AuthServiceDto";

@Service()
export class CollectionSubscriptionService {

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
		await dataSource.transaction(async transactionalEntityManager => {
			transactionalEntityManager.remove(collection);
		});

		return collection;
	}
	
	private async unSubscribePermanentCollection(collectionId: string, customerId: string): Promise<CollectionSubscription | null> {
		const collection = await CollectionSubscription.findOne({ where: { collectionId, subscriberId: customerId }});
		await dataSource.transaction(async transactionalEntityManager => {
			transactionalEntityManager.remove(collection);
		});

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

}