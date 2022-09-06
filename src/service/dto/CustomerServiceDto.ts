import { CollectionTemp } from "../../entity/CollectionTemp";
import { CustomerTemp } from "../../entity/CustomerTemp";

export interface CreateCustomerOutputDto {
	customer: CustomerTemp;
	collection: CollectionTemp;
}