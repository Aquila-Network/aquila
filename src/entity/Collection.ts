import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'collection'})
export class Collection extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	public id: string;

	@Column({ type: 'varchar', length: 25})
	public name: string;

	@Column({ type: 'varchar', length: 255})
	public desc: string;

	@Column({ name: 'customer_id', type: 'uuid' })
	public customerId: string;

	@Column({ name: 'aquila_db_name', type: 'varchar', length: 255, unique: true})
	public aquilaDbName: string;

	@Column({ name: 'is_shareable', type: 'boolean', default: true})
	public isShareable: boolean;

	@Column({ name: 'indexed_docs_count', type: 'bigint', default: 0})
	public indexedDocsCount: number;

	@CreateDateColumn({ name: 'created_at'})
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at'})
	public updatedAt: Date;

}