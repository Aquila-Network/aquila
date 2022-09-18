import 'reflect-metadata';
import express from 'express';
import { Container } from 'typedi';
import { useExpressServer, useContainer} from 'routing-controllers';
import { BullAdapter }  from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';

import db from './config/db';
import redisConnection from './config/redisConnection'; 
import { AquilaClientService } from './lib/AquilaClientService';
import { authorizationChecker } from './helper/auth';
import { currentUserChecker } from './helper/user';
import { getAppWorker } from './job/appWorker';
import { AppQueue } from './job/AppQueue';


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
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  const appQueue = Container.get(AppQueue);
  const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullAdapter(appQueue.queue)],
    serverAdapter: serverAdapter,
  });
  app.use('/admin/queues', serverAdapter.getRouter());

  return app;
}
