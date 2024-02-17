import { Worker } from "bullmq";
import Redis from "ioredis";

export function getAppWorker(connection: Redis) {
	const processorFile = `${__dirname}/appWorkerProcessor.js`;
	const worker = new Worker('APP', processorFile, { connection });
	return worker;
}