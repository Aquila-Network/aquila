import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { validate } from "../../../utils/validate";

@Service()
export class GetPublicCollectionByIdValidator implements ExpressMiddlewareInterface {
	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			param("collectionId")
				.isUUID()
				.withMessage("Invalid collection id"),
		];

		await validate(validators, req);
		next()
	}
}