import { Collection } from "../../entity/Collection";
import { CollectionTemp } from "../../entity/CollectionTemp";

export interface GetAllPublicCollectionReqQueryParamsDto {
	limit?: string;
	page?: string;
}

export interface GetAllPublicCollectionResPayloadDto {
	totalRecords: number;
	totalPages: number;
	currentPage: number,
	limit: number;
	collections: Collection[] | CollectionTemp[]
}

export interface GetAllFeaturedCollectionReqQueryParamsDto {
	limit?: string;
	page?: string;
}

export interface GetAllFeaturedCollectionResPayloadDto {
	totalRecords: number;
	totalPages: number;
	currentPage: number,
	limit: number;
	collections: Collection[] | CollectionTemp[]
}