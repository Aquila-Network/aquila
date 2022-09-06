import { CollectionTemp } from "../../entity/CollectionTemp";
import { CustomerTemp } from "../../entity/CustomerTemp";

export interface CreateCustomerResponseDto {
	customer: CustomerTemp,
	collection: CollectionTemp
}