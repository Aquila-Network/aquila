import { Service } from "typedi";
import { AppJobNames, AppQueue } from "../job/AppQueue";

@Service()
export class BookmarkService {

	public constructor(private appQueue: AppQueue) {}

	public async addBookmark() {
		await this.appQueue.add(AppJobNames.INDEX_DOCUMENT, { data: 'data'})
		return 'done';
	}	
}