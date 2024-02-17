import Redis from 'ioredis';
import { ConfigService } from '../lib/ConfigService';

const configService = new ConfigService();

const redisConnection = new Redis({
	host: configService.get('REDIS_HOST'),
	port: parseInt(configService.get('REDIS_PORT'), 10),
	username: configService.get('REDIS_USERNAME'),
	password: configService.get('REDIS_PASSWORD')
})

export default redisConnection;