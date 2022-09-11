import { Action, createParamDecorator } from "routing-controllers";
import Container from "typedi";
import { AuthService } from "../../service/AuthService";

export function JwtPayloadData() {
	return createParamDecorator({
		value: (action: Action) => {
			const token = action.request.headers.authorization.replace('Bearer ', '') || '';
			const authService = Container.get(AuthService);
			const payload = authService.decodeToken(token);
			return payload;
		}
	})
}