import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../../service/AuthService";

@Service()
@Middleware({type: 'before'})
export class TokenParserMiddleware implements ExpressMiddlewareInterface {
	public constructor(private authService: AuthService) {}

	public use(req: Request, res: Response, next: NextFunction) {
		const token = (req.headers.authorization || "").replace('Bearer ', '') || '';
		if(token) {
			req.token = token;
		}
		try{
			const payload = this.authService.decodeToken(token);
			req.jwtTokenPayload = payload;
		}catch(e) {}
		next();
	}
}