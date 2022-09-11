import { Action } from "routing-controllers";
import Container from "typedi";
import { AuthService } from "../service/AuthService";

export function authorizationChecker(action: Action): boolean {
	const token = action.request.headers.authorization?.replace('Bearer ', '') || '';
	const authService = Container.get(AuthService);	
	authService.authenticate(token);
	return true;
}