import { Body, JsonController, Post, QueryParams } from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../service/AuthService";
import { AccountStatus } from "../service/dto/AuthServiceDto";
import { LoginCustomerRequestBodyDto, LoginCustomerRequestParamDto, LoginCustomerResponseBodyDto } from "./dto/AuthControllerDto";

@Service()
@JsonController('/auth')
export class AuthController {

	public constructor(private authService: AuthService) {}

	@Post('/login')
	public async login(
		@Body() body: LoginCustomerRequestBodyDto,
		@QueryParams() params: LoginCustomerRequestParamDto
	): Promise<LoginCustomerResponseBodyDto> {
		const { accountStatus = AccountStatus.PERMANENT } = params;
		const token = await this.authService.login(body.secretKey, accountStatus);
		return {
			token
		}
	}

}