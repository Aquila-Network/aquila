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
	
	private async addPermanentCollectionSubscription(collectionId: string, customerId: string): Promise<CollectionSubscriptionTemp> {
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

}