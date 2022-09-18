import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1663310701557 implements MigrationInterface {
    name = 'bookmark1663310701557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bookmark_temp_status_enum" AS ENUM('NOT_PROCESSED', 'PROCESSING', 'PROCESSED')`);
        await queryRunner.query(`CREATE TABLE "bookmark_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "url" character varying(255) NOT NULL, "html" text NOT NULL, "title" character varying(100), "author" character varying(100), "cover_img" character varying(255), "summary" character varying(255), "links" character varying(255), "id_hidden" boolean NOT NULL DEFAULT false, "status" "public"."bookmark_temp_status_enum" NOT NULL DEFAULT 'NOT_PROCESSED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e23a591867b46d1d25cdd69421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookmark_status_enum" AS ENUM('NOT_PROCESSED', 'PROCESSING', 'PROCESSED')`);
        await queryRunner.query(`CREATE TABLE "bookmark" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "url" character varying(255) NOT NULL, "html" text NOT NULL, "title" character varying(100), "author" character varying(100), "cover_img" character varying(255), "summary" character varying(255), "links" character varying(255), "id_hidden" boolean NOT NULL DEFAULT false, "status" "public"."bookmark_status_enum" NOT NULL DEFAULT 'NOT_PROCESSED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b7fbf4a865ba38a590bb9239814" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bookmark"`);
        await queryRunner.query(`DROP TYPE "public"."bookmark_status_enum"`);
        await queryRunner.query(`DROP TABLE "bookmark_temp"`);
        await queryRunner.query(`DROP TYPE "public"."bookmark_temp_status_enum"`);
    }

}
