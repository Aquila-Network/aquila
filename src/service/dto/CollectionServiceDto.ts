import { Collection } from "../../entity/Collection";
import { CollectionTemp } from "../../entity/CollectionTemp";

export interface GetAllCollectionsInputOptionsDto {
	limit: number;
	page: number;
	where?: {
		isShareable?: boolean;
		isFeatured?: boolean;
	}
}

export interface GetAllCollectionsOutputDto {
	totalRecords: number;
	totalPages: number,
	currentPage: number,
	limit: number,
	collections: CollectionTemp[] | Collection[]
}