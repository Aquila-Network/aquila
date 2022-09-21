import { Authorized, CurrentUser, Get, JsonController, Param, Patch, Post } from "routing-controllers";
import { Service } from "typedi";

import { Customer } from "../entity/Customer";
import { CustomerTemp } from "../entity/CustomerTemp";
import { CustomerService } from "../service/CustomerService";
import { CreateCustomerResponseDto } from "./dto/CustomerControllerDto";

@Service()
@JsonController('/customer')
export class CustomerControler {

	public constructor(private customerService: CustomerService){}

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

	@Patch('/')
	public updateCustomer() {
		this.customerService
	}

}