import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmarkRenameIsHidden1663798659879 implements MigrationInterface {
    name = 'bookmarkRenameIsHidden1663798659879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmark" RENAME COLUMN "id_hidden" TO "is_hidden"`);
        await queryRunner.query(`ALTER TABLE "bookmark_temp" RENAME COLUMN "id_hidden" TO "is_hidden"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmark_temp" RENAME COLUMN "is_hidden" TO "id_hidden"`);
        await queryRunner.query(`ALTER TABLE "bookmark" RENAME COLUMN "is_hidden" TO "id_hidden"`);
    }

}
