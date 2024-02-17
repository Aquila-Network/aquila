import { CollectionTemp } from "../../entity/CollectionTemp";
import { CustomerTemp } from "../../entity/CustomerTemp";

export interface CreateCustomerInputDataDto {
	firstName: string;
	lastName: string;
}

export interface CreateCustomerOutputDto {
	customer: CustomerTemp;
	collection: CollectionTemp;
}

export interface ActivateCustomerByIdInputDataDto {
	firstName: string;
	lastName: string;
	email: string;
	desc: string;
	lightningAddress: string;
}

export interface UpdateCustomerByIdInputDataDto {
	firstName: string;
	lastName: string;
	email: string;
	desc: string;
	lightningAddress: string;
}

export interface GetCustomerPublicInfoByIdOutputDto {
	id: string;
	firstName: string;
	lastName: string;
	desc: string;
	customerId: number;
}

export interface GetRandomCustomerNameOutputDto {
	firstName: string;
	lastName: string;
}