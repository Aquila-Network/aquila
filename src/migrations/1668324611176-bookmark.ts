import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1668324611176 implements MigrationInterface {
    name = 'bookmark1668324611176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmark" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "bookmark" ADD "url" character varying(2048) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_fbcfcef552d9e814bc2980b4401" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_fbcfcef552d9e814bc2980b4401"`);
        await queryRunner.query(`ALTER TABLE "bookmark" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "bookmark" ADD "url" character varying(255) NOT NULL`);
    }

}
