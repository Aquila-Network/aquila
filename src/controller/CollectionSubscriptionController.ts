import { Body, Get, JsonController, Param, Post, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { CollectionSubscription } from "../entity/CollectionSubscription";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";

import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { AuthMiddleware } from "../middleware/global/AuthMiddleware";
import { AddCollectionSubscriptionValidator } from "../middleware/validator/csubscription/AddCollectionSubscriptionValidator";
import { RemoveCollectionSubscriptionValidator } from "../middleware/validator/csubscription/RemoveCollectionSubscriptionValidator";
import { CollectionSubscriptionService } from "../service/CollectionSubscriptionService";
import { JwtPayload } from "../service/dto/AuthServiceDto";

@Service()
@JsonController('/subscription')
export class CollectionSubscriptionController {

	public constructor(private collectionSubscriptionService: CollectionSubscriptionService) {}

	@UseBefore(AuthMiddleware)
	@Get('/list')
	public async listCollectionSubscription(
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<CollectionSubscriptionTemp[] | CollectionSubscription[]> {
		
		return await this.collectionSubscriptionService.getCollectionSubscriptionList(JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

	@UseBefore(AuthMiddleware, AddCollectionSubscriptionValidator)
	@Post('/:collectionId/add')
	public async addCollectionSubscription(
		@Param('collectionId') collectionId: string,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<CollectionSubscription|CollectionSubscriptionTemp> {
		
		return await this.collectionSubscriptionService.addCollectionSubscription(collectionId, JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

	@UseBefore(AuthMiddleware, RemoveCollectionSubscriptionValidator)
	@Post('/:collectionId/remove')
	public async removeCollectionSubscription(
		@Param('collectionId') collectionId: string,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<void> {
		
		return await this.collectionSubscriptionService.removeCollectionSubscription(collectionId, JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

}