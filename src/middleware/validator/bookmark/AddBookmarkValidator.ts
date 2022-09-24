import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import Container, { Service } from "typedi";

import { JwtPayloadData } from "../../../helper/decorators/jwtPayloadData";
import { CollectionService } from "../../../service/CollectionService";
import { JwtPayload } from "../../../service/dto/AuthServiceDto";
import { validate } from "../../../utils/validate";

@Service()
export class AddBookmarkValidator implements ExpressMiddlewareInterface {
	public constructor(private collectionService: CollectionService, @JwtPayloadData() private jwtPayloadData: JwtPayload) {}


	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			body('html')
				.trim().not().isEmpty()
				.withMessage("Html is required")
				.bail()
				.isLength({max: 900000})
				.withMessage("Html content length should be less than 900,000 characters"),

			body("url")
				.trim().not().isEmpty()
				.withMessage("Url is required")
				.bail()
				.isURL()
				.withMessage("Invalid url")
				.bail()
				.custom((value) => {
					const url = new URL(value);
					if(['www.localhost', 'localhost', 'www.127.0.0.1', '127.0.0.1'].includes(url.hostname)) {
						throw new Error(`Url '${value}' not allowed`)
					}
					return true;
				}),

			body('collectionId')
				.trim().not().isEmpty()
				.withMessage("Collection Id is required")
				.bail()
				.isUUID()
				.withMessage("Invalid Collection Id")
				.bail()
				.custom(async (value) => {
					const jwtPayloadData = req.jwtTokenPayload;
					if(jwtPayloadData) {
						const collectionService = Container.get(CollectionService);
						const collection = await collectionService.getCollectionById(value, jwtPayloadData.accountStatus);
						if(collection.customerId !== jwtPayloadData.customerId) {
							throw new Error("Invalid collection id");	
						}
					}
					return true;
				})
		]

		await validate(validators, req);
		next();
	}
} 