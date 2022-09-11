import { AccountStatus } from "../../service/dto/AuthServiceDto";

export interface LoginCustomerRequestBodyDto {
	secretKey: string;
}

export interface LoginCustomerRequestParamDto {
	accountStatus?: AccountStatus;
}

export interface LoginCustomerResponseBodyDto {
	token: string;
}