import { Authorized, Get, JsonController, Param, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";

import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { GetAllPublicCollectionValidator } from "../middleware/validator/collection/GetAllPublicCollectionValidator";
import { GetPublicCollectionByIdValidator } from "../middleware/validator/collection/GetPublicCollectionByIdValidator";
import { CollectionService } from "../service/CollectionService";
import { AccountStatus, JwtPayload } from "../service/dto/AuthServiceDto";
import { GetAllPublicCollectionReqQueryParamsDto, GetAllPublicCollectionResPayloadDto } from "./dto/CollectionControllerDto";

@Service()
@JsonController('/collection')
export class CollectionController {

	public constructor(private collectionService: CollectionService) {}

	@UseBefore(GetAllPublicCollectionValidator)
	@Get('/public')
	public async getAllPublicCollection(
		@QueryParams() queryParams: GetAllPublicCollectionReqQueryParamsDto
	): Promise<GetAllPublicCollectionResPayloadDto> {
		const options = {
			limit: queryParams.limit? parseInt(queryParams.limit) : 10,
			page: queryParams.page ? parseInt(queryParams.page)  : 1,
			where: {
				isShareable: true
			}
		};
		return await this.collectionService.getAllCollections(options, AccountStatus.PERMANENT);
	}
	
	@UseBefore(GetAllPublicCollectionValidator)
	@Get('/public/featured')
	public async getAllPublicFeaturedCollection(
		@QueryParams() queryParams: GetAllPublicCollectionReqQueryParamsDto
	): Promise<GetAllPublicCollectionResPayloadDto> {
		const options = {
			limit: queryParams.limit? parseInt(queryParams.limit) : 10,
			page: queryParams.page ? parseInt(queryParams.page)  : 1,
			where: {
				isShareable: true,
				isFeatured: true
			}
		};
		return await this.collectionService.getAllCollections(options, AccountStatus.PERMANENT);
	}

	@UseBefore(GetPublicCollectionByIdValidator)
	@Get('/public/:collectionId')
	public async getPublicCollectionById(
		@Param('collectionId') collectionId: string
	): Promise<Collection> {
		return await this.collectionService.getPublicCollectionById(collectionId);
	}

	@Authorized()
	@Get('/my-collections')
	public async getCurrentCustomerCollections(
		@JwtPayloadData() jwtPayload: JwtPayload
	): Promise<Collection[] | CollectionTemp[]> {
		const collections = await this.collectionService.getCustomerCollectionsByCustomerId(jwtPayload.customerId, jwtPayload.accountStatus);
		return collections;
	}	

}