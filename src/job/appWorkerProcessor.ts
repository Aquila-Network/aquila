import { Job } from "bullmq";
import { AppJobNames, AppQueue } from "./AppQueue";

export default async function(job: Job) {
	console.log("Job name is", job.name);
	if(job.name === AppJobNames.INDEX_DOCUMENT) {
		var sum = 0;
		for(var i = 0; i < 1000000000; i++) {
			sum += i;
		} 
		console.log("From worker", job.data, sum);
		return;
	}
}