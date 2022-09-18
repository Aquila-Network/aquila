import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1663498366253 implements MigrationInterface {
    name = 'bookmark1663498366253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmark_para_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookmark_id" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96228babfbf0e3d39503847b19f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bookmark_para_temp"`);
    }

}
