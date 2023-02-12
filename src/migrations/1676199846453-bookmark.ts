import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1676199846453 implements MigrationInterface {
    name = 'bookmark1676199846453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "lightning_address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_0eb8dbfdf208da3611520781da9" UNIQUE ("lightning_address")`);
        await queryRunner.query(`ALTER TABLE "bookmark_temp" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "bookmark_temp" ADD "url" character varying(2048) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmark_temp" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "bookmark_temp" ADD "url" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_0eb8dbfdf208da3611520781da9"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "lightning_address"`);
    }

}
