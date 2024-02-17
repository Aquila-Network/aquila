import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { validate } from "../../../utils/validate";

@Service()
export class CreateCustomerValidator implements ExpressMiddlewareInterface {
	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			body('firstName')
				.trim().not().isEmpty()
				.withMessage("First name is required")
				.isLength({ min: 3})
				.withMessage("First should have atleast 3 characters")
				.isLength({ max: 15})
				.withMessage("First should be less than or equal to 15 characters")
				.matches(/^[a-zA-Z]*[a-zA-Z]$/).withMessage("First name must contain only alpha characters"),

			body('lastName')
				.trim().not().isEmpty()
				.withMessage("Last name is required")
				.isLength({ min: 3})
				.withMessage("First should have atleast 3 characters")
				.isLength({ max: 15})
				.withMessage("First should be less than or equal to 15 characters")
				.matches(/^[a-zA-Z]*[a-zA-Z]$/).withMessage("Last name must contain only alpha characters"),
		];

		await validate(validators, req);

		next();

	}
}