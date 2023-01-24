import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'customer'})
export class Customer extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Generated("increment")
	@Column({ name: "customer_id", type: 'bigint'})
	public customerId: number;

	@Column({ 
		name: 'first_name',
		type: 'varchar',
		length: 20
	})
	public firstName: string;

	@Column({ 
		name: 'last_name',
		type: 'varchar',
		length: 20
	})
	public lastName: string;

	@Column({ type: 'varchar', length: 255})
	public avatar: string;

	@Column({ type: 'varchar', length: 50})
	public email: string;

	@Column({ type: 'varchar', length: 255})
	public desc: string;

	@Column({ 
		name: 'secret_key',
		type: 'varchar', 
		length: 255,
		unique: true
	})
	public secretKey: string;

	@Column({
		name: 'lightning_address',
		type: 'varchar',
		length: 255,
		unique: true,
		default: null
	})
	public lightningAddress: string | null;

	@Column({
		name: 'is_active',
		type: 'boolean',
		default: true
	})
	public isActive: boolean;

	@CreateDateColumn({ name: 'created_at'})
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at'})
	public updatedAt: Date;

}