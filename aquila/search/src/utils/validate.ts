import { Request } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { ValidationError } from "./errors/ValidationError";

export const validate = async (validations: ValidationChain[], req: Request) => {
	await Promise.all(validations.map(validation => validation.run(req)));

	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return;
	}
	// res.status(400).json({ errors: errors.array() });
	throw new ValidationError("Invalid data", errors.array())
} 