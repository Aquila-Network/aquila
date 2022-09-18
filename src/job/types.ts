import { Bookmark } from "../entity/Bookmark"
import { BookmarkTemp } from "../entity/BookmarkTemp"
import { AccountStatus } from "../service/dto/AuthServiceDto";

export enum AppJobNames {
	INDEX_DOCUMENT = 'INDEX_DOCUMENT'
}

export interface IndexDocumentData {
	bookmark: Bookmark | BookmarkTemp;
	accountStatus: AccountStatus
}

export interface AddData {
	name: string;
}

export type AppJobData = IndexDocumentData;