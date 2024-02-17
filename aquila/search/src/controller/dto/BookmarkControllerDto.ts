export interface AddBookmarkReqBodyDto {
	html?: string;
	url: string;
	collectionId: string;
}

export interface GetBookmarksByCollectionIdReqQueryParamsDto {
	query?: string;
	limit?: string;
	page?: string;
}

export interface GetBookmarksByCollectionIdResBodyDto {
	totalPages: number;
	totalRecords: number;
	currentPage: number;	
	limit: number;
	bookmarks: {
		id: string;
		collectionId: string;
		url: string;
		title: string;
		author: string;
		coverImg: string;
		summary: string
		description: string;
	}[] 
}

export interface GetFeaturedBookmarksReqQueryParamsDto {
	limit?: string;
	page?: string;
}

export interface GetFeaturedBookmarksResBodyDto {
	totalPages: number;
	totalRecords: number;
	currentPage: number;	
	limit: number;
	bookmarks: {
		id: string;
		collectionId: string;
		url: string;
		title: string;
		author: string;
		coverImg: string;
		summary: string
		description: string;
	}[] 
}