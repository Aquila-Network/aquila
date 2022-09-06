import { NextFunction, Request, Response } from "express";
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Middleware({ type: 'after'})
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
	error(err: Error, req: Request, res: Response, next: NextFunction) {
		if (err instanceof HttpError) {
			return res.status(err.httpCode).send({
				code: err.httpCode,
				name: err.name,
				message: err.message,
			});
		} else {
			const env = process.env.NODE_ENV;
			res.status(500).send({
				code: 500,
				name:  env === 'development' ? err.name : 'Unknown Error',
				message: env === 'development' ? err.message : 'Something went wrong',
				stack: env === 'development' ? err.stack : null,
			});
		}
		next();
	}
}