import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmark1676714378990 implements MigrationInterface {
    name = 'bookmark1676714378990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bookmark_status_enum" AS ENUM('NOT_PROCESSED', 'PROCESSING', 'PROCESSED')`);
        await queryRunner.query(`CREATE TABLE "bookmark" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "url" character varying(2048) NOT NULL, "html" text NOT NULL, "title" character varying(2048), "author" character varying(100), "cover_img" character varying(2048), "summary" text, "links" character varying(2048), "is_hidden" boolean NOT NULL DEFAULT false, "status" "public"."bookmark_status_enum" NOT NULL DEFAULT 'NOT_PROCESSED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b7fbf4a865ba38a590bb9239814" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookmark_para_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookmark_id" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96228babfbf0e3d39503847b19f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookmark_para" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookmark_id" character varying NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_80453e30c727ef75d8d3a227ae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookmark_temp_status_enum" AS ENUM('NOT_PROCESSED', 'PROCESSING', 'PROCESSED')`);
        await queryRunner.query(`CREATE TABLE "bookmark_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "url" character varying(2048) NOT NULL, "html" text NOT NULL, "title" character varying(100), "author" character varying(100), "cover_img" character varying(255), "summary" character varying(255), "links" character varying(255), "is_hidden" boolean NOT NULL DEFAULT false, "status" "public"."bookmark_temp_status_enum" NOT NULL DEFAULT 'NOT_PROCESSED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e23a591867b46d1d25cdd69421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" BIGSERIAL NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20) NOT NULL, "avatar" character varying(255) NOT NULL, "email" character varying(50) NOT NULL, "desc" character varying(255) NOT NULL, "secret_key" character varying(255) NOT NULL, "lightning_address" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5f387140f14dda0d07e8c69d94e" UNIQUE ("secret_key"), CONSTRAINT "UQ_0eb8dbfdf208da3611520781da9" UNIQUE ("lightning_address"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(25) NOT NULL, "desc" character varying(255) NOT NULL, "customer_id" uuid NOT NULL, "aquila_db_name" character varying(255) NOT NULL, "is_shareable" boolean NOT NULL DEFAULT true, "indexed_docs_count" bigint NOT NULL DEFAULT '0', "is_featured" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6f5b901feb7458d7f0ae8e40a0" UNIQUE ("aquila_db_name"), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "subscriber_id" uuid NOT NULL, "subscribed_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_871ce8ad8c0bd303596085c69b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_subscription_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "collection_id" uuid NOT NULL, "subscriber_id" uuid NOT NULL, "subscribed_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0c00e1823a7935706679daab419" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(25) NOT NULL, "desc" character varying(255) NOT NULL, "customer_id" uuid NOT NULL, "aquila_db_name" character varying(255) NOT NULL, "is_shareable" boolean NOT NULL DEFAULT true, "indexed_docs_count" bigint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_55a8fd150df3f170c789a81affe" UNIQUE ("aquila_db_name"), CONSTRAINT "PK_658841bdb83ea4263af2e64a683" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" BIGSERIAL NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20) NOT NULL, "avatar" character varying(255) NOT NULL, "desc" character varying(255) NOT NULL, "secret_key" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0754f469522cf14ad9beae89a61" UNIQUE ("secret_key"), CONSTRAINT "PK_0a1542f39ffea6cffd26ce1a731" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_fbcfcef552d9e814bc2980b4401" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_fbcfcef552d9e814bc2980b4401"`);
        await queryRunner.query(`DROP TABLE "customer_temp"`);
        await queryRunner.query(`DROP TABLE "collection_temp"`);
        await queryRunner.query(`DROP TABLE "collection_subscription_temp"`);
        await queryRunner.query(`DROP TABLE "collection_subscription"`);
        await queryRunner.query(`DROP TABLE "collection"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "bookmark_temp"`);
        await queryRunner.query(`DROP TYPE "public"."bookmark_temp_status_enum"`);
        await queryRunner.query(`DROP TABLE "bookmark_para"`);
        await queryRunner.query(`DROP TABLE "bookmark_para_temp"`);
        await queryRunner.query(`DROP TABLE "bookmark"`);
        await queryRunner.query(`DROP TYPE "public"."bookmark_status_enum"`);
    }

}
