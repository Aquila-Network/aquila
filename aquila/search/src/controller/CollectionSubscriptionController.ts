import { Body, Get, JsonController, Param, Post, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { Collection } from "../entity/Collection";
import { CollectionSubscription } from "../entity/CollectionSubscription";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";

import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { AuthMiddleware } from "../middleware/global/AuthMiddleware";
import { SubscribeCollectionValidator } from "../middleware/validator/csubscription/SubscribeCollectionValidator";
import { UnSubscribeCollectionValidator } from "../middleware/validator/csubscription/UnSubscribeCollectionValidator";
import { CollectionSubscriptionService } from "../service/CollectionSubscriptionService";
import { JwtPayload } from "../service/dto/AuthServiceDto";
import { GetSubscriptionsByCustomerIdOptionsInputDto } from "../service/dto/CollectionSubscriptionServiceDto";
import { GetSubscriptionsByCustomerIdReqQueryParamsDto, GetSubscriptionsByCustomerIdResBodyDto } from "./dto/CollectionSubscriptionControllerDto";

@Service()
@JsonController('/subscription')
export class CollectionSubscriptionController {

	public constructor(private collectionSubscriptionService: CollectionSubscriptionService) {}

	@UseBefore(AuthMiddleware)
	@Get('/list')
	public async getCurrentCustomerSubscriptions(
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<CollectionSubscriptionTemp[] | CollectionSubscription[]> {
		
		return await this.collectionSubscriptionService.getCustomerSubscriptions(JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

	@UseBefore(AuthMiddleware, SubscribeCollectionValidator)
	@Post('/:collectionId/add')
	public async subscribeCollection(
		@Param('collectionId') collectionId: string,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<CollectionSubscription|CollectionSubscriptionTemp> {
		
		return await this.collectionSubscriptionService.subscribeCollection(collectionId, JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

	@UseBefore(AuthMiddleware)
	@Post('/:collectionId/is-subscribed')
	public async isCollectionAlreadySubscribed(
		@Param('collectionId') collectionId: string,
		@JwtPayloadData() jwtPayloadData: JwtPayload
	):Promise<{ isSubscribed: boolean}> {
		const isSubscribed = await this.collectionSubscriptionService.isCollectionSubscribedByCustomer(collectionId, jwtPayloadData.customerId, jwtPayloadData.accountStatus);
		return { isSubscribed };
	}

	@UseBefore(AuthMiddleware, UnSubscribeCollectionValidator)
	@Post('/:collectionId/remove')
	public async unSubscribeCollection(
		@Param('collectionId') collectionId: string,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<CollectionSubscription | CollectionSubscriptionTemp | null> {
		
		return await this.collectionSubscriptionService.unSubscribeCollection(collectionId, JwtPayloadData.customerId, JwtPayloadData.accountStatus);
	}

	@Get('/')
	@UseBefore(AuthMiddleware)
	public async getSubscriptionsByCustomerId(
		@JwtPayloadData() jwtPayloadData: JwtPayload,
		@QueryParams() queryParams: GetSubscriptionsByCustomerIdReqQueryParamsDto,
	): Promise<GetSubscriptionsByCustomerIdResBodyDto> {
		const options: GetSubscriptionsByCustomerIdOptionsInputDto = {
			limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
			page: queryParams.page ? parseInt(queryParams.page, 10) : 1
		}
		if(queryParams.query) {
			options.query = queryParams.query;
		}
		return await this.collectionSubscriptionService.getSubscriptionsByCustomerId(jwtPayloadData.customerId, options, jwtPayloadData.accountStatus);
	}

	@UseBefore(AuthMiddleware)
	@Get('/collections')
	public async getCustomerSubscribedCollections(
		@JwtPayloadData() jwtPayloadData: JwtPayload,
	): Promise<Collection[]> {
		return await this.collectionSubscriptionService.getCustomerSubscribedCollections(jwtPayloadData.customerId, jwtPayloadData.accountStatus);
	}

}