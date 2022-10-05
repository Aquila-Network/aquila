import { BadRequestError, InternalServerError } from "routing-controllers";
import { Service } from "typedi";
import { In, createQueryBuilder } from "typeorm";

import dataSource from "../config/db";
import { Bookmark, BookmarkStatus } from "../entity/Bookmark";
import { BookmarkPara } from "../entity/BookmarkPara";
import { BookmarkParaTemp } from "../entity/BookmarkParaTemp";
import { BookmarkTemp, BookmarkTempStatus } from "../entity/BookmarkTemp";
import { Collection } from "../entity/Collection";
import { CollectionTemp } from "../entity/CollectionTemp";
import { AppQueue } from "../job/AppQueue";
import { AppJobNames, IndexDocumentData } from "../job/types";
import { AquilaClientService } from "../lib/AquilaClientService";
import { AccountStatus } from "./dto/AuthServiceDto";
import { AddBookmarkInputDto, GetAllBookmarksByCollectionIdOptionsInputDto, GetBookmarksByCollectionIdOutputDto, GetBookmarksByCollectionIdOptionsInputDto, GetFeaturedBookmarksOutputDto } from "./dto/BookmarkServiceDto";

@Service()
export class BookmarkService {

	public constructor(private appQueue: AppQueue, private aquilaClientService: AquilaClientService) {}

	private async addTemporaryBookmark(data: AddBookmarkInputDto): Promise<BookmarkTemp> {
		let bookmark = new BookmarkTemp();
		await dataSource.transaction(async transactionalEntityManager => {
			bookmark.url = data.url;
			bookmark.html = data.html;
			bookmark.collectionId = data.collectionId;
			await transactionalEntityManager.save(bookmark);

			await this.appQueue.add<IndexDocumentData>(AppJobNames.INDEX_DOCUMENT, { accountStatus: AccountStatus.TEMPORARY, bookmark: bookmark});
		})
		return bookmark;
	}

	private async addPermanentBookmark(data: AddBookmarkInputDto): Promise<Bookmark> {
		let bookmark = new Bookmark();
		await dataSource.transaction(async transactionalEntityManager => {
			bookmark.url = data.url;
			bookmark.html = data.html;
			bookmark.collectionId = data.collectionId;
			await transactionalEntityManager.save(bookmark);

			await this.appQueue.add<IndexDocumentData>(AppJobNames.INDEX_DOCUMENT, { accountStatus: AccountStatus.PERMANENT, bookmark: bookmark});
		})
		return bookmark;
	}

	public async addBookmark(data: AddBookmarkInputDto, accountStatus: AccountStatus): Promise<Bookmark|BookmarkTemp> {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.addTemporaryBookmark(data);
		}
		return await this.addPermanentBookmark(data);
	}	

	private async getAllTemporaryBookmarksByCollectionId(collectionId: string, options: GetAllBookmarksByCollectionIdOptionsInputDto): Promise<GetBookmarksByCollectionIdOutputDto> {
		const skip = (options.page - 1) * options.limit;
		const take = options.limit;
		const totalRecords = await BookmarkTemp.count({ where: { collectionId, status: BookmarkTempStatus.PROCESSED }});
		const bookmarks = await BookmarkTemp.find({ where: { collectionId, status: BookmarkTempStatus.PROCESSED }, skip, take });
		// find all paragraphs for bookmark
		const bookmarkIds = bookmarks.map(item => item.id);
		const paras = await BookmarkParaTemp.find({ where: { bookmarkId: In(bookmarkIds)}});
		const bookmarkData = bookmarks.map(item => ({
			id: item.id,
			collectionId: item.collectionId,
			url: item.url,
			title: item.title,
			author: item.author,
			coverImg: item.coverImg,
			summary: item.summary,
			description: paras.find(para => para.bookmarkId === item.id)?.content || ''
		}));
		return {
			totalRecords,
			totalPages: Math.ceil(totalRecords / take),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}
	}

	private async getAllPermanentBookmarksByCollectionId(collectionId: string, options: GetAllBookmarksByCollectionIdOptionsInputDto): Promise<GetBookmarksByCollectionIdOutputDto> {
		const skip = (options.page - 1) * options.limit;
		const take = options.limit;
		const totalRecords = await Bookmark.count({ where: { collectionId, status: BookmarkStatus.PROCESSED }});
		const bookmarks = await Bookmark.find({ where: { collectionId, status: BookmarkStatus.PROCESSED}, skip, take });
		// find all paragraphs for bookmark
		const bookmarkIds = bookmarks.map(item => item.id);
		const paras = await BookmarkPara.find({ where: { bookmarkId: In(bookmarkIds)}});
		const bookmarkData = bookmarks.map(item => ({
			id: item.id,
			collectionId: item.collectionId,
			url: item.url,
			title: item.title,
			author: item.author,
			coverImg: item.coverImg,
			summary: item.summary,
			description: paras.find(para => para.bookmarkId === item.id)?.content || ''
		}));
		return {
			totalRecords,
			totalPages: Math.ceil(totalRecords / take),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}	
	}

	private async getTemporaryBookmarksByCollectionId(collectionId: string, options: GetBookmarksByCollectionIdOptionsInputDto): Promise<GetBookmarksByCollectionIdOutputDto> {
		if(!options.query) {
			return await this.getAllTemporaryBookmarksByCollectionId(collectionId, options);
		}
		const collection = await CollectionTemp.findOne({ where: { id: collectionId }});
		if(!collection) {
			throw new BadRequestError("Invalid collection id");
		}
		// generate vector from hub for the search query
		const vector = await this.aquilaClientService.getHubServer().compressDocument(collection.aquilaDbName, options.query) as number[][];
		if(vector.length === 0) {
			throw new InternalServerError("Something went wrong");
		}

		// search on aquiladb
		const { docs, dists } = await this.aquilaClientService.getDbServer().searchKDocuments(collection.aquilaDbName, vector, 10)
		const documentObjs: any = {};
		const newDists = dists[0].map(dist => (1 - dist))
		docs[0].forEach((doc: any, index: number) => {
			const docExists = documentObjs[doc.metadata.bookmark_id];
			if(docExists) {
				docExists.dist = docExists.dist + newDists[index];
				docExists.paras.push({ dist: newDists[index], para: doc.metadata.para});
			}else {
				documentObjs[doc.metadata.bookmark_id] = {
					bookmarkParaId: doc.metadata.bookmark_para_id,
					bookmarkId: doc.metadata.bookmark_id,
					dist:  newDists[index],
					paras: [{ dist: newDists[index], para: doc.metadata.para}]
				}
			}
		});
		const documents = Object.values(documentObjs).sort((a: any, b: any) => (b.dist - a.dist))

		// sort result from aquiladb and select records within limit and offset
		const totalRecords = documents.length;
		const start = (options.page -1) * options.limit;
		const end = ((options.page -1) * options.limit) + options.limit;
		const records = documents.slice(start, end);

		// fetch all bookmarks
		const bookmarkIds = records.map((item: any) => item.bookmarkId);
		const bookmarks = await BookmarkTemp.find({ where: { id: In(bookmarkIds)}});

		// generate result
		const bookmarkData = records.map((item: any) => {
			const bookmark = bookmarks.find(data => data.id === item.bookmarkId) as BookmarkTemp;
			return ({
				id: bookmark.id,
				collectionId: bookmark.collectionId,
				url: bookmark.url,
				title: bookmark.title,
				author: bookmark.author,
				coverImg: bookmark.coverImg,
				summary: bookmark.summary,
				description: item.paras[0].para
			});
		});
		const output = {
			totalRecords,
			totalPages: Math.ceil(totalRecords / options.limit),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}
		return output;
	} 

	private async getPermanentBookmarksByCollectionId(collectionId: string, options: GetBookmarksByCollectionIdOptionsInputDto): Promise<GetBookmarksByCollectionIdOutputDto> {
		if(!options.query) {
			return await this.getAllPermanentBookmarksByCollectionId(collectionId, options);
		}
		const collection = await Collection.findOne({ where: { id: collectionId }});
		if(!collection) {
			throw new BadRequestError("Invalid collection id");
		}
		// generate vector from hub for the search query
		const vector = await this.aquilaClientService.getHubServer().compressDocument(collection.aquilaDbName, options.query) as number[][];
		if(vector.length === 0) {
			throw new InternalServerError("Something went wrong");
		}

		// search on aquiladb
		const { docs, dists } = await this.aquilaClientService.getDbServer().searchKDocuments(collection.aquilaDbName, vector, 10)
		const documentObjs: any = {};
		const newDists = dists[0].map(dist => (1 - dist))
		docs[0].forEach((doc: any, index: number) => {
			const docExists = documentObjs[doc.metadata.bookmark_id];
			if(docExists) {
				docExists.dist = docExists.dist + newDists[index];
				docExists.paras.push({ dist: newDists[index], pata: doc.metadata.para});
			}else {
				documentObjs[doc.metadata.bookmark_id] = {
					bookmarkParaId: doc.metadata.bookmark_para_id,
					bookmarkId: doc.metadata.bookmark_id,
					dist:  newDists[index],
					paras: [{ dist: newDists[index], para: doc.metadata.para}]
				}
			}
		});
		const documents = Object.values(documentObjs).sort((a: any, b: any) => (b.dist - a.dist))

		// sort result from aquiladb and select records within limit and offset
		const totalRecords = documents.length;
		const start = (options.page -1) * options.limit;
		const end = ((options.page -1) * options.limit) + options.limit;
		const records = documents.slice(start, end);

		// fetch all bookmarks
		const bookmarkIds = records.map((item: any) => item.bookmarkId);
		const bookmarks = await Bookmark.find({ where: { id: In(bookmarkIds)}});

		// generate result
		const bookmarkData = records.map((item: any) => {
			const bookmark = bookmarks.find(data => data.id === item.bookmarkId) as Bookmark;
			return ({
				id: bookmark.id,
				collectionId: bookmark.collectionId,
				url: bookmark.url,
				title: bookmark.title,
				author: bookmark.author,
				coverImg: bookmark.coverImg,
				summary: bookmark.summary,
				description: item.paras[0].para
			});
		});
		const output = {
			totalRecords,
			totalPages: Math.ceil(totalRecords / options.limit),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}
		return output;
	}

	public async getBookmarksByCollectionId(collectionId: string, options: GetBookmarksByCollectionIdOptionsInputDto, accountStatus: AccountStatus): Promise<GetBookmarksByCollectionIdOutputDto> {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.getTemporaryBookmarksByCollectionId(collectionId, options);
		}
		return await this.getPermanentBookmarksByCollectionId(collectionId, options);
	}

	public async getFeaturedBookmarks(options: GetBookmarksByCollectionIdOptionsInputDto): Promise<GetFeaturedBookmarksOutputDto> {
		const skip = (options.page - 1) * options.limit;
		const take = options.limit;
		const query = Bookmark.createQueryBuilder("bookmark")
							.innerJoinAndSelect(Collection, "collection", "collection.id = bookmark.collectionId")
							.where("collection.isFeatured = :isFeatured", { isFeatured: true })
							.orderBy("RAND(123)")
		const totalRecords = await query.getCount()
		const featuredBookmarks = await query.skip(skip).take(take).getMany()
		// find all paragraphs for bookmark
		const bookmarkIds = featuredBookmarks.map(item => item.id);
		const paras = await BookmarkPara.find({ where: { bookmarkId: In(bookmarkIds)}});
		const bookmarkData = featuredBookmarks.map(item => ({
			id: item.id,
			collectionId: item.collectionId,
			url: item.url,
			title: item.title,
			author: item.author,
			coverImg: item.coverImg,
			summary: item.summary,
			description: paras.find(para => para.bookmarkId === item.id)?.content || ''
		}));
		return {
			totalRecords,
			totalPages: Math.ceil(totalRecords / take),
			currentPage: options.page,
			limit: options.limit,
			bookmarks: bookmarkData
		}	
	}
}