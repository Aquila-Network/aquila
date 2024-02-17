import { Action } from "routing-controllers";
import Container from "typedi";
import { Customer } from "../entity/Customer";
import { CustomerTemp } from "../entity/CustomerTemp";
import { AuthService } from "../service/AuthService";
import { CustomerService } from "../service/CustomerService";

export async function currentUserChecker(action: Action): Promise<Customer|CustomerTemp> {
	const token = (action.request.headers.authorization || "").replace('Bearer ', '') || '';
	const authService = Container.get(AuthService);
	const customerService = Container.get(CustomerService);
	const payload = authService.decodeToken(token);
	const customer = await customerService.getCustomerById(payload.customerId, payload.accountStatus);
	return customer;
}