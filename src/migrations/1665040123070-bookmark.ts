import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1665040123070 implements MigrationInterface {
    name = 'bookmark1665040123070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" ADD "is_featured" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "is_featured"`);
    }

}
