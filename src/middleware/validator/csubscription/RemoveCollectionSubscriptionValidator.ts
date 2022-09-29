import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { ExpressMiddlewareInterface } from "routing-controllers";
import Container, { Service } from "typedi";

import { JwtPayloadData } from "../../../helper/decorators/jwtPayloadData";
import { CollectionSubscriptionService } from "../../../service/CollectionSubscriptionService";
import { AccountStatus, JwtPayload } from "../../../service/dto/AuthServiceDto";
import { validate } from "../../../utils/validate";

@Service()
export class RemoveCollectionSubscriptionValidator implements ExpressMiddlewareInterface {
	public constructor(private collectionSubService: CollectionSubscriptionService, @JwtPayloadData() private jwtPayloadData: JwtPayload) {}


	public async use(req: Request, res: Response, next: NextFunction) {
		const validators = [
			param('collectionId')
				.trim().not().isEmpty()
				.withMessage("Collection Id is required")
				.bail()
				.isUUID()
				.withMessage("Invalid Collection Id")
				.bail()
				.custom(async (value) => {
					const jwtPayloadData = req.jwtTokenPayload;
					if(jwtPayloadData) {
						const collectionSubService = Container.get(CollectionSubscriptionService);
						const collection = await collectionSubService.getCollectionSubscription(value, jwtPayloadData.customerId, jwtPayloadData.accountStatus);
						if(collection === null) {
							throw new Error("Collection is not already subscribed");	
						}
					}
					return true;
				})
		];

		await validate(validators, req);
		next();
	}
} 