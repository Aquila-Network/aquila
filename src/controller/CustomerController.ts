import { Authorized, Body, CurrentUser, Get, JsonController, Param, Patch, Post, Put, UseBefore } from "routing-controllers";
import { Service } from "typedi";

import { Customer } from "../entity/Customer";
import { CustomerTemp } from "../entity/CustomerTemp";
import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { AuthMiddleware } from "../middleware/global/AuthMiddleware";
import { ActivateCustomerValidator } from "../middleware/validator/customer/ActivateCustomerValidator";
import { CreateCustomerValidator } from "../middleware/validator/customer/CreateCustomerValidator";
import { GetCustomerPublicInfoByIdValidator } from "../middleware/validator/customer/GetCustomerPublicInfoByIdValidator";
import { UpdateCustomerValidator } from "../middleware/validator/customer/UpdateCustomerValidator";
import { CustomerService } from "../service/CustomerService";
import { JwtPayload } from "../service/dto/AuthServiceDto";
import { ActivateCustomerReqBodyDto, CreateCustomerReqBodyDto, CreateCustomerResponseDto, GetCustomerPublicInfoByIdRespBodyDto, GetRandomCustomerNameRespBodyDto, UpdateCustomerReqBodyDto } from "./dto/CustomerControllerDto";

@Service()
@JsonController('/customer')
export class CustomerControler {

	public constructor(private customerService: CustomerService){}

	@UseBefore(AuthMiddleware, UpdateCustomerValidator)
	@Patch('/')
	public async updateCustomer(
		@JwtPayloadData() JwtPayloadData: JwtPayload,
		@Body() body: UpdateCustomerReqBodyDto
	):Promise<Customer> {
		return await this.customerService.updateCustomerById(JwtPayloadData.customerId, body);
	}

	@UseBefore(GetCustomerPublicInfoByIdValidator)
	@Get('/public/:customerId')
	public async getCustomerPublicInfoById(
		@Param('customerId') customerId: string
	): Promise<GetCustomerPublicInfoByIdRespBodyDto> {
		return await this.customerService.getCustomerPublicInfoById(customerId);
	}	

	@Authorized()
	@Get('/me')
	public async getCustomerById(
		@CurrentUser() customer: Customer | CustomerTemp
	): Promise<Customer|CustomerTemp> {
		return customer;
	}

	@UseBefore(CreateCustomerValidator)
	@Post('/')
	public async createCustomer(
		@Body() body: CreateCustomerReqBodyDto
	): Promise<CreateCustomerResponseDto> {
		return await this.customerService.createCustomer(body);
	}

	@UseBefore(AuthMiddleware,ActivateCustomerValidator)
	@Post('/activate')
	public async activateCustomer(
		@JwtPayloadData() jwtPayloadData: JwtPayload,
		@Body() body: ActivateCustomerReqBodyDto
	): Promise<Customer> {
		return await this.customerService.activateCustomerById(jwtPayloadData.customerId, body);
	}	

	@Get('/generate-name')
	public async generateRandomCustomerName(
	): Promise<GetRandomCustomerNameRespBodyDto> {
		return await this.customerService.getRandomCustomerName();
	}

}