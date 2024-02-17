import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

import { validate } from "../../../utils/validate";

@Service()
export class UnSubscribeCollectionValidator implements ExpressMiddlewareInterface {

	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			param('collectionId')
				.trim().not().isEmpty()
				.withMessage("Collection Id is required")
				.bail()
				.isUUID()
				.withMessage("Invalid Collection Id")
		];

		await validate(validators, req);
		next();
	}
} 