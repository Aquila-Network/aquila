export interface CreateNewCollectionReqPayloadDto {
	html: string;
	url: string;
	collectionId: string;
}

export interface GetAllPublicCollectionReqQueryParamsDto {
	limit?: string;
	page?: string;
}