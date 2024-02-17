export interface GetSubscriptionsByCustomerIdOptionsInputDto {
	limit: number;
	page: number;
	query?: string;
}

export interface BookmarkData {
	id: string;
	collectionId: string;
	url: string;
	title: string;
	author: string;
	coverImg: string;
	summary: string
	description: string;
}

export interface GetSubscriptionsByCustomerIdOutputDto {
	totalPages: number;
	totalRecords: number;
	currentPage: number;	
	limit: number;
	bookmarks: BookmarkData[] 
}