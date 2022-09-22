import { CollectionTemp } from "../../entity/CollectionTemp";
import { CustomerTemp } from "../../entity/CustomerTemp";

export interface CreateCustomerResponseDto {
	customer: CustomerTemp,
	collection: CollectionTemp
}

export interface ActivateCustomerReqBodyDto {
	firstName: string;
	lastName: string;
	email: string;
	desc: string;
}

export interface UpdateCustomerReqBodyDto {
	firstName: string;
	lastName: string;
	email: string;
	desc: string;
}