import { Authorized, Get, JsonController, Param } from "routing-controllers";
import { Service } from "typedi";

import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { CollectionService } from "../service/CollectionService";
import { JwtPayload } from "../service/dto/AuthServiceDto";

@Service()
@JsonController('/collection')
export class CollectionController {

	public constructor(private collectionService: CollectionService) {}

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