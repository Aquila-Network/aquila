import { Authorized, Body, Get, JsonController, Param, Post, QueryParams } from "routing-controllers";
import { Service } from "typedi";

import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { CollectionService } from "../service/CollectionService";
import { AccountStatus, JwtPayload } from "../service/dto/AuthServiceDto";
import { CreateNewCollectionReqPayloadDto, GetAllPublicCollectionReqQueryParamsDto } from "./dto/CollectionControllerDto";

@Service()
@JsonController('/collection')
export class CollectionController {

	public constructor(private collectionService: CollectionService) {}

	@Authorized()
	@Post('/')
	public async createNewCollection(
		@Body() data: CreateNewCollectionReqPayloadDto,
		@JwtPayloadData() jwtPayload: JwtPayload
	) {
		this.collectionService	
	}

	@Get('/public')
	public async getAllPublicCollection(
		@QueryParams() queryParams: GetAllPublicCollectionReqQueryParamsDto
	) {
		const options = {
			limit: queryParams.limit? parseInt(queryParams.limit) : 10,
			page: queryParams.page ? parseInt(queryParams.page)  : 1,
			where: {
				isShareable: true
			}
		};
		return await this.collectionService.getAllCollections(options, AccountStatus.PERMANENT);
	}

	@Get('/public/:collectionId')
	public async getPublicCollectionById(
		@Param('collectionId') collectionId: string
	) {
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

	@Authorized()
	@Get('/my-connections/:collectionId/documents')
	public async getCollectionDocuments(
		@JwtPayloadData() jwtPayloadData: JwtPayload,
		@Param('collectionId') collectionId: string
	) {
		const documents = await this.collectionService.getCollectionDocumentsByCollectionId(collectionId, jwtPayloadData.accountStatus);
		return documents;
	}
}