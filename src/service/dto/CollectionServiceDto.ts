import { Collection } from "../../entity/Collection";
import { CollectionTemp } from "../../entity/CollectionTemp";

export interface CreateCollectionDto {
	html: string;
	url: string;
	collectionId: string;
}

export interface GetAllCollectionsInputOptionsDto {
	limit: number;
	page: number;
	where?: {
		isShareable?: boolean;
	}
}

export interface getAllCollectionsOutputDto {
	totalRecords: number;
	totalPages: number,
	currentPage: number,
	limit: number,
	collections: CollectionTemp[] | Collection[]
}