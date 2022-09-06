import 'reflect-metadata';
import express from 'express';
import { Container } from 'typedi';
import { useExpressServer, useContainer} from 'routing-controllers';

import db from './config/db';
import { AquilaClientService } from './lib/AquilaClientService';

export default async function main() {
  useContainer(Container);

  const app = express();
  useExpressServer(app, {
    cors: true,
    middlewares: [`${__dirname}/middleware/**/*.{ts,js}`],
    controllers: [`${__dirname}/controller/*.js`],
    defaultErrorHandler: false
  });

  await db.initialize();
  const aqc = Container.get(AquilaClientService);
  await aqc.connect();

  return app;
}
