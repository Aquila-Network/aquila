import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { useExpressServer, useContainer, HttpError} from 'routing-controllers';
import cors from 'cors';

useContainer(Container);
const app = express();
app.use(cors());
useExpressServer(app, {
	middlewares: [express.json()],
	controllers: [`${__dirname}/controller/*.js`]
});

// exception handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.httpCode).send({
      code: err.httpCode,
      name: err.name,
      message: err.message,
    });
  } else {
    res.status(500).send({
      code: 500,
      name: 'Unknown Error',
      message: 'Something went wrong',
    });
  }
  next();
});

export default app;