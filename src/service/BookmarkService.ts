import { Service } from "typedi";

import dataSource from "../config/db";
import { Bookmark } from "../entity/Bookmark";
import { BookmarkTemp } from "../entity/BookmarkTemp";
import { AppQueue } from "../job/AppQueue";
import { AppJobNames, IndexDocumentData } from "../job/types";
import { AccountStatus } from "./dto/AuthServiceDto";
import { AddBookmarkInputDto } from "./dto/BookmarkServiceDto";

@Service()
export class BookmarkService {

	public constructor(private appQueue: AppQueue) {}

	private async addTemporaryBookmark(data: AddBookmarkInputDto) {
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

	private async addPermanentBookmark(data: AddBookmarkInputDto) {
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

	public async addBookmark(data: AddBookmarkInputDto, accountStatus: AccountStatus) {
		if(accountStatus === AccountStatus.TEMPORARY) {
			return await this.addTemporaryBookmark(data);
		}
		return await this.addPermanentBookmark(data);
	}	
}