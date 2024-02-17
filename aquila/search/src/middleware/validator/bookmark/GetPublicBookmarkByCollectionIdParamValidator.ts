import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { ExpressMiddlewareInterface, NotFoundError } from "routing-controllers";
import Container, { Service } from "typedi";
import { CollectionService } from "../../../service/CollectionService";
import { AccountStatus } from "../../../service/dto/AuthServiceDto";
import { validate } from "../../../utils/validate";

@Service()
export class GetPublicBookmarkByCollectionIdParamValidator implements ExpressMiddlewareInterface {
	public async use(req: Request, res: Response, next: NextFunction) {
		const collectionService = Container.get(CollectionService);
		const collection = await collectionService.getCollectionById(req.params.customerId, AccountStatus.PERMANENT);
		if(!collection.isShareable) {
			throw new NotFoundError("Collection Not found");
		}
		next();
	}
}