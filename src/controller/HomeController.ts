import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { Queue } from 'bullmq';

@Service()
@JsonController('/')
export class HomeController {

	@Get('/')
	public index() {

		const queue = new Queue('Paint',  { connection: {
			host: "redis-17256.c17.us-east-1-4.ec2.cloud.redislabs.com",
			port: 17256,
			username: 'default',
			password: 'AbcRVEZFVHYjRNPFxAwLcSdUCA4DuUll'
		}});
		
		queue.add('cars', { color: 'blue' });
		return {
			msg: "Welcome to Aquila X"
		}
	}

}