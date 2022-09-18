import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum BookmarkTempStatus {
	NOT_PROCESSED = 'NOT_PROCESSED',
	PROCESSING = 'PROCESSING',
	PROCESSED = 'PROCESSED',
}

@Entity({ name: 'bookmark_temp'})
export class BookmarkTemp extends BaseEntity {

	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ name: 'collection_id', type: 'uuid', nullable: false})
	public collectionId: string;

	@Column({ type: 'varchar', length: 255, nullable: false})
	public url: string;

	@Column({ type: 'text', nullable: false})
	public html: string;

	@Column({ type: 'varchar', length: 100, nullable: true})
	public title: string;

	@Column({ type: 'varchar', length: 100, nullable: true})
	public author: string;

	@Column({ name: 'cover_img', type: 'varchar', length: 255, nullable: true})
	public coverImg: string;

	@Column({ type: 'varchar', length: 255, nullable: true})
	public summary: string;

	@Column({ type: 'varchar', length: 255, nullable: true})
	public links: string;

	@Column({ name: 'id_hidden', type: 'boolean', default: false})
	public isHidden: boolean;

	@Column({ type: 'enum', enum: BookmarkTempStatus, default: BookmarkTempStatus.NOT_PROCESSED})
	public status: BookmarkTempStatus;

	@CreateDateColumn({ name: 'created_at'})
	public createdAt: Date;

	@UpdateDateColumn({name: 'updated_at'})
	public updatedAt: Date;

}