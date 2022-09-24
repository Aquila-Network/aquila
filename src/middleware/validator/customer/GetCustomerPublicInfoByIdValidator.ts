import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { validate } from "../../../utils/validate";

@Service()
export class GetCustomerPublicInfoByIdValidator implements ExpressMiddlewareInterface {
	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			param('customerId')
				.isUUID()
				.withMessage("Invalid Customer Id")
		];

		await validate(validators, req);
		next();
	}
}