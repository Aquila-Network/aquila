import { Service } from "typedi";
import randomAnimalName from 'random-animal-name';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import base58 from 'bs58';

import dataSource from '../config/db';
import { CustomerTemp } from "../entity/CustomerTemp";
import { CollectionTemp } from "../entity/CollectionTemp";
import { CreateCustomerOutputDto } from "./dto/CustomerServiceDto";
import { AquilaClientService } from "../lib/AquilaClientService";
import { Customer } from "../entity/Customer";
import { NotFoundError } from "routing-controllers";
import { AccountStatus } from "./dto/AuthServiceDto";

@Service()
export class CustomerService {

	public constructor(private aquilaClientService: AquilaClientService) {}

	public async getCustomerById(id: string, accountStatus: AccountStatus) {
		if(accountStatus === AccountStatus.PERMANENT) {
			return await this.getPermanentCustomerById(id);
		}	
		return await this.getTemporaryCustomerById(id);
	}

	private async getPermanentCustomerById(id: string): Promise<Customer> {
		let customer: Customer | null = await Customer.findOne({ where: { id: id }});
		if(!customer) {
			throw new NotFoundError("Customer not found");
		}
		return customer;
	}

	private async getTemporaryCustomerById(id: string): Promise<CustomerTemp> {
		let customer: CustomerTemp | null = await CustomerTemp.findOne({ where: { id: id }});
		if(!customer) {
			throw new NotFoundError("Customer not found");
		}
		return customer;
	}

	public async createCustomer(): Promise<CreateCustomerOutputDto> {

		const customer = new CustomerTemp();
		const collection = new CollectionTemp();

		await dataSource.transaction(async transactionalEntityManager => {
			// create an new record in customer
			const [firstName, lastName] = randomAnimalName().split(' ');

			const randomNumber = Math.random().toString();
			const hash = crypto.createHash('sha256');
			const avatar = hash.update(randomNumber).digest('hex');

			const randomData = Buffer.from(uuidv4().substring(0, 14) + Date.now());
			const secretKey = base58.encode(randomData);

			const desc = 'Hi I’m using Aquila Network to help curate the web. I’ll be sharing some awesome websites with you. Don’t forget to follow me and support my work.';

			customer.firstName = firstName;
			customer.lastName = lastName;
			customer.avatar = avatar;
			customer.secretKey = secretKey;
			customer.desc = desc;
			await transactionalEntityManager.save(customer);

			// create a aquilaDb
			const aquilaDbName = await this.aquilaClientService.createCollection(desc, secretKey);

			// create an new record in collection
			const collectionName = 'My Collection #1';
			const collectionDesc = 'Hi I’m using Aquila Network to help curate the web. I’ll be sharing some awesome websites with you. Don’t forget to follow me and support my work.';
			const customerId = customer.id;

			collection.name = collectionName;
			collection.desc = collectionDesc;
			collection.customerId = customerId;
			collection.aquilaDbName = aquilaDbName;
			await transactionalEntityManager.save(collection);
		})

		return {
			customer,
			collection
		}
	}

	public updateCustomer() {
		return false;
	}

}