import { Queue } from "bullmq";
import { Service } from "typedi";
import connection from '../config/redisConnection';

export enum AppJobNames {
	INDEX_DOCUMENT = 'INDEX_DOCUMENT'
}

interface AppQueueData {

}

@Service()
export class AppQueue {
	private queue: Queue;

	public constructor(){
		this.queue = new Queue<AppQueueData>("APP", { connection })
	}

	public async add(name: AppJobNames, data: AppQueueData) {
		return await this.queue.add(name, data);
	}
}