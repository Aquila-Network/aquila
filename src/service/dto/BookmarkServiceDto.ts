import { Bookmark } from "../../entity/Bookmark";
import { BookmarkTemp } from "../../entity/BookmarkTemp";

export interface AddBookmarkInputDto {
	html: string;
	url: string;
	collectionId: string;
}

export interface GetBookmarksByCollectionIdOptionsInputDto {
	limit: number;
	page: number;
	query?: string;
}

export type GetAllBookmarksByCollectionIdOptionsInputDto = Omit<GetBookmarksByCollectionIdOptionsInputDto, 'query'>;

export interface GetFeaturedBookmarksOptionsInputDto {
	limit: number;
	page: number;
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

export interface GetBookmarksByCollectionIdOutputDto {
	totalPages: number;
	totalRecords: number;
	currentPage: number;	
	limit: number;
	bookmarks: BookmarkData[] 
}

export interface GetFeaturedBookmarksOutputDto {
	totalPages: number;
	totalRecords: number;
	currentPage: number;	
	limit: number;
	bookmarks: BookmarkData[] 
}