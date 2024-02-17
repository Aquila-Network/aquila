import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { validate } from "../../../utils/validate";

@Service()
export class GetFeaturedBookmarkValidator implements ExpressMiddlewareInterface {
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
			.withMessage("Page should be greater than or equal to 1")

		];

		await validate(validators, req)

		next();
	}
}