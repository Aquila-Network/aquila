import { NextFunction, Request } from "express";
import { query } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { validate } from "../../../utils/validate";

@Service()
export class GetAllPublicCollectionValidator implements ExpressMiddlewareInterface {
	async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			query("limit")
				.optional()
				.isNumeric()
				.withMessage("Limit must be a number")
				.isInt({min: 1})
				.withMessage("Limit must be greater than 1")
				.isInt({ max: 10 })
				.withMessage("Limit must be less than or equal to 10"),

			query("page")
				.optional()
				.isNumeric()
				.withMessage("Page must be a number")

		]
		await validate(validators, req);
		next();
	}
}