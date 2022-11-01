import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

import { JwtPayloadData } from "../../../helper/decorators/jwtPayloadData";
import { CollectionSubscriptionService } from "../../../service/CollectionSubscriptionService";
import { JwtPayload } from "../../../service/dto/AuthServiceDto";

@Service()
export class SubscribeCollectionValidator implements ExpressMiddlewareInterface {
	public constructor(private collectionSubService: CollectionSubscriptionService, @JwtPayloadData() private jwtPayloadData: JwtPayload) {}


	public async use(req: Request, res: Response, next: NextFunction) {
		const jwtPayloadData = req.jwtTokenPayload;
		if(jwtPayloadData) {
			const status = await this.collectionSubService.isCollectionSubscribedByCustomer(req.params.collectionId, jwtPayloadData.customerId, jwtPayloadData.accountStatus);
			if(status) {
				throw new Error("Collection is already subscribed");	
			}
		}
		next();
	}
} 