import { CollectionTemp } from "../../entity/CollectionTemp";
import { CustomerTemp } from "../../entity/CustomerTemp";

export interface CreateCustomerOutputDto {
	customer: CustomerTemp;
	collection: CollectionTemp;
}

export interface ActivateCustomerByIdInputDataDto {
	firstName: string;
	lastName: string;
	email: string;
	desc: string;
}

export interface UpdateCustomerByIdInputDataDto {
	firstName: string;
	lastName: string;
	email: string;
	desc: string;
}