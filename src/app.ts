import 'reflect-metadata';
import express from 'express';
import { Container } from 'typedi';
import { useExpressServer, useContainer} from 'routing-controllers';

import db from './config/db';
import redisConnection from './config/redisConnection'; 
import { AquilaClientService } from './lib/AquilaClientService';
import { authorizationChecker } from './helper/auth';
import { currentUserChecker } from './helper/user';
import { getAppWorker } from './job/appWorker';


export default async function main() {
  useContainer(Container);

  const app = express();
  useExpressServer(app, {
    cors: true,
    authorizationChecker,
    currentUserChecker,
    middlewares: [`${__dirname}/middleware/**/*.{ts,js}`],
    controllers: [`${__dirname}/controller/*.js`],
    defaultErrorHandler: false
  });

  await db.initialize();
  const appWorker = getAppWorker(redisConnection);
  const aqc = Container.get(AquilaClientService);
  await aqc.connect();

  return app;
}
