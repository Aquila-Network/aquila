import { MigrationInterface, QueryRunner } from "typeorm";

export class collectionRenameIsShareable1663776187261 implements MigrationInterface {
    name = 'collectionRenameIsShareable1663776187261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" RENAME COLUMN "is_shereable" TO "is_shareable"`);
        await queryRunner.query(`ALTER TABLE "collection_temp" RENAME COLUMN "is_shereable" TO "is_shareable"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection_temp" RENAME COLUMN "is_shareable" TO "is_shereable"`);
        await queryRunner.query(`ALTER TABLE "collection" RENAME COLUMN "is_shareable" TO "is_shereable"`);
    }

}
