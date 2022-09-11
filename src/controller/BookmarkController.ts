import { JsonController, Get } from "routing-controllers";
import { Service } from "typedi";
import { BookmarkService } from "../service/BookmarkService";

@Service()
@JsonController('/bookmark')
export class BookmarkController {

	public constructor(private bookmarkService: BookmarkService) {}

	@Get('/')
	public addBookmark() {
		return this.bookmarkService.addBookmark();
	}
}