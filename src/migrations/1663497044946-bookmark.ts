import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1663497044946 implements MigrationInterface {
    name = 'bookmark1663497044946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmark_para" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookmark_id" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_80453e30c727ef75d8d3a227ae1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bookmark_para"`);
    }

}
