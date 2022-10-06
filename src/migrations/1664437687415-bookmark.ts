import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1664437687415 implements MigrationInterface {
    name = 'bookmark1664437687415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collection_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "subscriber_id" uuid NOT NULL, "subscribed_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_871ce8ad8c0bd303596085c69b3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "collection_subscription"`);
    }

}
