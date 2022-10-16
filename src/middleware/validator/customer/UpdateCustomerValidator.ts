import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { validate } from "../../../utils/validate";

@Service()
export class UpdateCustomerValidator implements ExpressMiddlewareInterface {
	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			body('firstName')
				.trim().not().isEmpty()
				.withMessage("First name is required")
				.isLength({ min: 3})
				.withMessage("First should have atleast 3 characters")
				.isLength({ max: 15})
				.withMessage("First should be less than or equal to 15 characters")
				.matches(/^[a-zA-Z]*[a-zA-Z]$/).withMessage("Description must contain only alpha numeric characters"),

			body('lastName')
				.trim().not().isEmpty()
				.withMessage("Last name is required")
				.isLength({ min: 3})
				.withMessage("First should have atleast 3 characters")
				.isLength({ max: 15})
				.withMessage("First should be less than or equal to 15 characters")
				.matches(/^[a-zA-Z]*[a-zA-Z]$/).withMessage("Description must contain only alpha numeric characters"),

			body('email')
				.trim().not().isEmpty()
				.withMessage("Email is required")	
				.isEmail()
				.withMessage("Invalid email"),

			body('desc')
				.trim().not().isEmpty()
				.withMessage("Description is required")
				.isLength({ min: 50})
				.withMessage("Description should have atleast 50 characters")
				.isLength({max: 255})
				.withMessage("Description should be less than or equal to 255 characters")
				// .matches(/^[a-zA-Z0-9]*[a-zA-Z0-9]$/).withMessage("Description must contain only alpha numeric characters"),
		];

		await validate(validators, req);

		next();

	}
}