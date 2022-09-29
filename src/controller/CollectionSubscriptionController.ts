import { Body, Get, JsonController, Param, Post, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { CollectionSubscription } from "../entity/CollectionSubscription";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";

import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { AuthMiddleware } from "../middleware/global/AuthMiddleware";
import { AddCollectionSubscriptionValidator } from "../middleware/validator/csubscription/AddCollectionSubscriptionValidator";
import { CollectionSubscriptionService } from "../service/CollectionSubscriptionService";
import { JwtPayload } from "../service/dto/AuthServiceDto";

@Service()
@JsonController('/subscription')
export class CollectionSubscriptionController {

	public constructor(private collectionSubscriptionService: CollectionSubscriptionService) {}

	@UseBefore(AuthMiddleware, AddCollectionSubscriptionValidator)
	@Post('/:collectionId/add')
	public async addCollectionSubscription(
		@Param('collectionId') collectionId: string,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<CollectionSubscription|CollectionSubscriptionTemp> {
		
		return await this.collectionSubscriptionService.addCollectionSubscription(collectionId, JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

}