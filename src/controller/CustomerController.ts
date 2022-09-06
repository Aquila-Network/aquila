import { JsonController, Patch, Post } from "routing-controllers";
import { Service } from "typedi";
import { CustomerService } from "../service/CustomerService";
import { CreateCustomerResponseDto } from "./dto/CustomerControllerDto";

@Service()
@JsonController('/customer')
export class CustomerControler {

	public constructor(private customerService: CustomerService){}

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