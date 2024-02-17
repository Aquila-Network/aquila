import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'collection_subscription_temp'})
export class CollectionSubscriptionTemp extends BaseEntity {

	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ name: 'collection_id', type: 'uuid', nullable: false})
	public collectionId: string;

	@Column({ name: 'subscriber_id', type: 'uuid', nullable: false})
	public subscriberId: string;

	@CreateDateColumn({ name: 'subscribed_at'})
	public subscribedAt: Date;

	@CreateDateColumn({ name: 'created_at'})
	public createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	public updatedAt: Date;

}