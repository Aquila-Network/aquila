import { Jwt } from "jsonwebtoken";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Patch, Post, Put } from "routing-controllers";
import { Service } from "typedi";

import { Customer } from "../entity/Customer";
import { CustomerTemp } from "../entity/CustomerTemp";
import { JwtPayloadData } from "../helper/decorators/jwtPayloadData";
import { CustomerService } from "../service/CustomerService";
import { JwtPayload } from "../service/dto/AuthServiceDto";
import { ActivateCustomerReqBodyDto, CreateCustomerResponseDto, UpdateCustomerReqBodyDto } from "./dto/CustomerControllerDto";

@Service()
@JsonController('/customer')
export class CustomerControler {

	public constructor(private customerService: CustomerService){}

	@Authorized()
	@Put('/')
	public async updateCustomer(
		@JwtPayloadData() JwtPayloadData: JwtPayload,
		@Body() body: UpdateCustomerReqBodyDto
	) {
		return await this.customerService.updateCustomerById(JwtPayloadData.customerId, body);
	}

	@Get('/public/:customerId')
	public async getCustomerPublicInfoById(
		@Param('customerId') customerId: string
	) {
		return await this.customerService.getCustomerPublicInfoById(customerId);
	}

	@Authorized()
	@Get('/me')
	public async getCustomerById(
		@CurrentUser() customer: Customer | CustomerTemp
	) {
		return customer;
	}

	@Post('/')
	public async createCustomer(): Promise<CreateCustomerResponseDto> {
		const data = await this.customerService.createCustomer();
		return data;
	}

	@Authorized()
	@Post('/activate')
	public async activateCustomer(
		@JwtPayloadData() jwtPayloadData: JwtPayload,
		@Body() body: ActivateCustomerReqBodyDto
	) {
		return await this.customerService.activateCustomerById(jwtPayloadData.customerId, body);
	}	

}