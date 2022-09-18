import { Authorized, Body, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";

import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { BookmarkService } from "../service/BookmarkService";
import { JwtPayload } from "../service/dto/AuthServiceDto";
import { AddBookmarkReqBodyDto } from "./dto/BookmarkControllerDto";

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
}