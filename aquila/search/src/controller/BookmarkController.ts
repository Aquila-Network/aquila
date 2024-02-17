import { Body, Get, JsonController, Param, Post, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { Bookmark } from "../entity/Bookmark";
import { BookmarkTemp } from "../entity/BookmarkTemp";

import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { AuthMiddleware } from "../middleware/global/AuthMiddleware";
import { AddBookmarkValidator } from "../middleware/validator/bookmark/AddBookmarkValidator";
import { GetBookmarkByCollectionIdValidator } from "../middleware/validator/bookmark/GetBookmarkByCollectionIdValidator";
import { GetFeaturedBookmarkValidator } from "../middleware/validator/bookmark/GetFeaturedBookmarkValidator";
import { GetPublicBookmarkByCollectionIdParamValidator } from "../middleware/validator/bookmark/GetPublicBookmarkByCollectionIdParamValidator";
import { GetPublicBookmarkByCollectionIdValidator } from "../middleware/validator/bookmark/GetPublicBookmarkByCollectionIdValidator";
import { BookmarkService } from "../service/BookmarkService";
import { AccountStatus, JwtPayload } from "../service/dto/AuthServiceDto";
import { GetBookmarksByCollectionIdOptionsInputDto, GetFeaturedBookmarksOptionsInputDto } from "../service/dto/BookmarkServiceDto";
import { AddBookmarkReqBodyDto, GetBookmarksByCollectionIdReqQueryParamsDto, GetBookmarksByCollectionIdResBodyDto, GetFeaturedBookmarksReqQueryParamsDto, GetFeaturedBookmarksResBodyDto } from "./dto/BookmarkControllerDto";

@Service()
@JsonController('/bookmark')
export class BookmarkController {

	public constructor(private bookmarkService: BookmarkService) {}

	@UseBefore(AuthMiddleware, AddBookmarkValidator)
	@Post('/')
	public async addBookmark(
		@Body() body: AddBookmarkReqBodyDto,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<Bookmark|BookmarkTemp> {
		return await this.bookmarkService.addBookmark(body, JwtPayloadData.accountStatus);
	}

	@UseBefore(AuthMiddleware, GetBookmarkByCollectionIdValidator)
	@Get('/:collectionId/search')
	public async getBookmarksByCollectionId(
		@Param('collectionId') collectionId: string,
		@QueryParams() queryParams: GetBookmarksByCollectionIdReqQueryParamsDto,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	): Promise<GetBookmarksByCollectionIdResBodyDto> {
		const options: GetBookmarksByCollectionIdOptionsInputDto = {
			limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
			page: queryParams.page ? parseInt(queryParams.page, 10) : 1
		}
		if(queryParams.query) {
			options.query = queryParams.query;
		}
		return this.bookmarkService.getBookmarksByCollectionId(collectionId, options, JwtPayloadData.accountStatus);
	}

	@UseBefore(GetPublicBookmarkByCollectionIdValidator, GetPublicBookmarkByCollectionIdParamValidator)
	@Get('/public/:collectionId/search')
	public async getPublicBookmarksByCollectionId(
		@Param('collectionId') collectionId: string,
		@QueryParams() queryParams: GetBookmarksByCollectionIdReqQueryParamsDto,
	): Promise<GetBookmarksByCollectionIdResBodyDto> {
		const options: GetBookmarksByCollectionIdOptionsInputDto = {
			limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
			page: queryParams.page ? parseInt(queryParams.page, 10) : 1
		}
		if(queryParams.query) {
			options.query = queryParams.query;
		}
		return this.bookmarkService.getBookmarksByCollectionId(collectionId, options, AccountStatus.PERMANENT);
	}

	@UseBefore(GetFeaturedBookmarkValidator)
	@Get('/public/featured')
	public async getAllFeaturedBookmark(
		@QueryParams() queryParams: GetFeaturedBookmarksReqQueryParamsDto
	): Promise<GetFeaturedBookmarksResBodyDto> {
		const options: GetFeaturedBookmarksOptionsInputDto = {
			limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
			page: queryParams.page ? parseInt(queryParams.page, 10) : 1
		}
		return this.bookmarkService.getFeaturedBookmarks(options);
	}
	
}