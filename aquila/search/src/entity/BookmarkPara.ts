import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('bookmark_para')
export class BookmarkPara extends BaseEntity {

	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ name: 'bookmark_id', nullable: false})
	public bookmarkId: string;

	@Column({ type: 'text', nullable: false})
	public content: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

}