import { Job, Queue } from "bullmq";
import { Service } from "typedi";
import connection from '../config/redisConnection';
import { AppJobNames } from "./types";


@Service()
export class AppQueue {
	public queue: Queue;

	public constructor(){
		this.queue = new Queue("APP", { connection })
	}

	public async add<T>(name: AppJobNames, data: T) {
		return await this.queue.add(name, data);
	}
}