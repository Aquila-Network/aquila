import { Customer } from "./Customer";

export interface Collection {
    id: string;
    name: string;
    desc: string;
    customerId: string;
    customer?:  Customer;
}