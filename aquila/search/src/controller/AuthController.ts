import { Body, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../service/AuthService";
import { LoginCustomerRequestBodyDto, LoginCustomerResponseBodyDto } from "./dto/AuthControllerDto";

@Service()
@JsonController('/auth')
export class AuthController {

	public constructor(private authService: AuthService) {}

	@Post('/login')
	public async login(
		@Body() body: LoginCustomerRequestBodyDto
	): Promise<LoginCustomerResponseBodyDto> {
		const token = await this.authService.login(body.secretKey);
		return {
			token
		}
	}

}