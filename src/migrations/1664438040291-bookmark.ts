import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1664438040291 implements MigrationInterface {
    name = 'bookmark1664438040291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collection_subscription_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "subscriber_id" uuid NOT NULL, "subscribed_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0c00e1823a7935706679daab419" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "collection_subscription_temp"`);
    }

}
