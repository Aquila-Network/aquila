import { Authorized, Body, Get, JsonController, Param, Post, QueryParams } from "routing-controllers";
import { Service } from "typedi";

import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { BookmarkService } from "../service/BookmarkService";
import { JwtPayload } from "../service/dto/AuthServiceDto";
import { GetBookmarksByCollectionIdOptionsInputDto } from "../service/dto/BookmarkServiceDto";
import { AddBookmarkReqBodyDto, GetBookmarksByCollectionIdReqQueryParamsDto } from "./dto/BookmarkControllerDto";

@Service()
@JsonController('/bookmark')
export class BookmarkController {

	public constructor(private bookmarkService: BookmarkService) {}

	@Authorized()
	@Post('/')
	public async addBookmark(
		@Body() body: AddBookmarkReqBodyDto,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	) {
		const bookmark = await this.bookmarkService.addBookmark(body, JwtPayloadData.accountStatus);
		return bookmark
	}

	@Authorized()
	@Get('/:collectionId/search')
	public async getBookmarksByCollectionId(
		@Param('collectionId') collectionId: string,
		@QueryParams() queryParams: GetBookmarksByCollectionIdReqQueryParamsDto,
		@JwtPayloadData() JwtPayloadData: JwtPayload
	) {
		const options: GetBookmarksByCollectionIdOptionsInputDto = {
			limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
			page: queryParams.page ? parseInt(queryParams.page, 10) : 0
		}
		if(queryParams.q) {
			options.query = queryParams.q;
		}
		return this.bookmarkService.getBookmarksByCollectionId(collectionId, options, JwtPayloadData.accountStatus);
	}
}