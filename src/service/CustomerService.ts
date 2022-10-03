import { Service } from "typedi";
import randomAnimalName from 'random-animal-name';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import base58 from 'bs58';

import dataSource from '../config/db';
import { CustomerTemp } from "../entity/CustomerTemp";
import { CollectionTemp } from "../entity/CollectionTemp";
import { ActivateCustomerByIdInputDataDto, CreateCustomerInputDataDto, CreateCustomerOutputDto, GetCustomerPublicInfoByIdOutputDto, GetRandomCustomerNameOutputDto, UpdateCustomerByIdInputDataDto } from "./dto/CustomerServiceDto";
import { AquilaClientService } from "../lib/AquilaClientService";
import { Customer } from "../entity/Customer";
import { NotFoundError } from "routing-controllers";
import { AccountStatus } from "./dto/AuthServiceDto";
import { BookmarkTemp } from "../entity/BookmarkTemp";
import { In } from "typeorm";
import { BookmarkPara } from "../entity/BookmarkPara";
import { BookmarkParaTemp } from "../entity/BookmarkParaTemp";
import { Collection } from "../entity/Collection";
import { Bookmark, BookmarkStatus } from "../entity/Bookmark";
import { CollectionSubscriptionTemp } from "../entity/CollectionSubscriptionTemp";
import { CollectionSubscription } from "../entity/CollectionSubscription";

@Service()
export class CustomerService {

	public constructor(private aquilaClientService: AquilaClientService) {}

	public async getRandomCustomerName(): Promise<GetRandomCustomerNameOutputDto> {
		const [firstName, lastName] = randomAnimalName().split(' ');

		return {
			firstName, 
			lastName
		};
	}

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

	public async createCustomer(data: CreateCustomerInputDataDto): Promise<CreateCustomerOutputDto> {

		const customer = new CustomerTemp();
		const collection = new CollectionTemp();

		await dataSource.transaction(async transactionalEntityManager => {
			// create an new record in customer
			const {firstName, lastName} = data;

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

	public async updateCustomerById(id: string, data: UpdateCustomerByIdInputDataDto) {
		const customer = await this.getPermanentCustomerById(id);
		customer.firstName = data.firstName;
		customer.lastName = data.lastName;
		customer.desc = data.desc;
		customer.email = data.email;
		customer.save();
		return customer;
	}

	public async getCustomerPublicInfoById(id: string): Promise<GetCustomerPublicInfoByIdOutputDto> {
		const customer = await this.getPermanentCustomerById(id);
		return {
			id: id,
			firstName: customer.firstName,
			lastName: customer.lastName,
			desc: customer.desc,
			customerId: customer.customerId
		};
	}

	public async activateCustomerById(id: string, data: ActivateCustomerByIdInputDataDto): Promise<Customer> {
		// get temporary custoemr
		const customerTemp = await this.getTemporaryCustomerById(id);

		// get all collections to permanent account
		const collectionsTemp = await CollectionTemp.find({ where: { customerId: id }});
		const collectionTempIds = collectionsTemp.map(item =>  item.id);

		// get all bookmarks to permanent account
		const bookmarksTemp = await BookmarkTemp.find({ where: { collectionId: In(collectionTempIds) }})
		const bookmarkTempIds = await bookmarksTemp.map(item => item.id);

		// get all bookmark paras to permanent account
		const bookmarkParasTemp = await BookmarkParaTemp.find({ where: { bookmarkId: In(bookmarkTempIds)}})

		// get all collection subscriptions to permanent account
		const collectionSubTemp = await CollectionSubscriptionTemp.find({ where: { subscriberId: id}})

		// create customer
		const customer = new Customer();
		customer.id = customerTemp.id;
		customer.avatar = customerTemp.avatar;
		customer.firstName = data.firstName;
		customer.lastName = data.lastName;
		customer.email = data.email;
		customer.desc = data.desc;
		customer.secretKey = customerTemp.secretKey;
		customer.createdAt = customerTemp.createdAt;

		// create collections
		const collections = collectionsTemp.map(item => {
			const collection = new Collection();
			collection.id = item.id;
			collection.desc = item.desc;
			collection.aquilaDbName = item.aquilaDbName;
			collection.customerId = item.customerId;
			collection.name = item.name;
			collection.isShareable = item.isShareable;
			collection.indexedDocsCount = item.indexedDocsCount;
			collection.createdAt = item.createdAt;
			return collection;
		});

		// create bookmarks
		const bookmarks = bookmarksTemp.map(item => {
			const bookmark = new Bookmark();
			bookmark.id = item.id;
			bookmark.title = item.title;
			bookmark.collectionId = item.collectionId;
			bookmark.coverImg = item.coverImg;
			bookmark.author = item.author;
			bookmark.html = item.html;
			bookmark.url = item.url;
			bookmark.summary = item.summary;
			bookmark.links = item.links;
			bookmark.isHidden = item.isHidden;
			bookmark.status = item.status as unknown as BookmarkStatus;
			bookmark.createdAt = item.createdAt;
			return bookmark;
		});

		// create bookmark paras
		const bookmarkParas = bookmarkParasTemp.map(item => {
			const bookmarkPara = new BookmarkPara();
			bookmarkPara.id = item.id;
			bookmarkPara.content = item.content;
			bookmarkPara.bookmarkId = item.bookmarkId;
			bookmarkPara.createdAt = item.createdAt;
			return bookmarkPara;
		});

		// create collection subscriptions
		const collectionSubs = collectionSubTemp.map(item => {
			const collectionSub = new CollectionSubscription();
			collectionSub.id = item.id;
			collectionSub.subscriberId = item.subscriberId;
			collectionSub.collectionId = item.collectionId;
			collectionSub.subscribedAt = item.subscribedAt;
			collectionSub.createdAt = item.createdAt;
			return collectionSub;
		});

		await dataSource.transaction(async transactionalEntityManager => {
			transactionalEntityManager.save(customer);
			transactionalEntityManager.save(collections);
			transactionalEntityManager.save(bookmarks);
			transactionalEntityManager.save(bookmarkParas);
			transactionalEntityManager.save(collectionSubs);
			transactionalEntityManager.remove(customerTemp);
			transactionalEntityManager.remove(collectionsTemp);
			transactionalEntityManager.remove(bookmarksTemp);
			transactionalEntityManager.remove(bookmarkParasTemp);
			transactionalEntityManager.remove(collectionSubTemp);
		});
		return customer;
	}

}