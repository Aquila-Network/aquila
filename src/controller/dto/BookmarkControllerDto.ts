export interface AddBookmarkReqBodyDto {
	html: string;
	url: string;
	collectionId: string;
}

export interface GetBookmarksByCollectionIdReqQueryParamsDto {
	q?: string;
	limit?: string;
	page?: string;
}