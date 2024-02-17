import { NextFunction, Request, Response } from "express";
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { ValidationError } from "../../utils/errors/ValidationError";

@Service()
@Middleware({ type: 'after', priority: 1})
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
	error(err: Error, req: Request, res: Response, next: NextFunction) {
		console.log(err);
		if( err instanceof ValidationError) {
			return res.status(err.httpCode).send({
				code: err.httpCode,
				name: err.name,
				message: err.message,
				errors: err.errors
			});
		}
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