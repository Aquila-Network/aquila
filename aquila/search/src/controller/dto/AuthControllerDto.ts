import { AccountStatus } from "../../service/dto/AuthServiceDto";

export interface LoginCustomerRequestBodyDto {
	secretKey: string;
}

export interface LoginCustomerResponseBodyDto {
	token: string;
}