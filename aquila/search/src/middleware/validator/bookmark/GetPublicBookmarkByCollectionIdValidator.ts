import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import Container, { Service } from "typedi";
import { CollectionService } from "../../../service/CollectionService";
import { AccountStatus } from "../../../service/dto/AuthServiceDto";
import { validate } from "../../../utils/validate";

@Service()
export class GetPublicBookmarkByCollectionIdValidator implements ExpressMiddlewareInterface {
	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
		query("limit")
			.optional()
			.isNumeric()
			.withMessage("Limit should be number")
			.isInt({ min: 1})
			.withMessage("Limit should be greater than or equal to 1")
			.isInt({ max: 10 })
			.withMessage("Limit should be less than or equal to 10"),

		query("page")
			.optional()
			.isNumeric()
			.withMessage("Page should be number")
			.isInt({ min: 1})
			.withMessage("Page should be greater than or equal to 1"),
			
		query("query")
			.optional()
			.isLength({ max: 50})
			.withMessage("Query must be less than 50 characters"),
		
		param("collectionId")
			.isUUID()
			.withMessage("Invalid collection")
		];

		await validate(validators, req)

		next();
	}
}