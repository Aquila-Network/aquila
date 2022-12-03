export interface GetSubscriptionsByCustomerIdReqQueryParamsDto {
	query?: string;
	limit?: string;
	page?: string;
}

export interface GetSubscriptionsByCustomerIdResBodyDto {
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