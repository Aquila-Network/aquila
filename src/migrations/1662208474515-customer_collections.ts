import { MigrationInterface, QueryRunner } from "typeorm";

export class customerCollections1662208474515 implements MigrationInterface {
    name = 'customerCollections1662208474515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(25) NOT NULL, "desc" character varying(255) NOT NULL, "customer_id" uuid NOT NULL, "aquila_db_name" character varying(255) NOT NULL, "is_shereable" boolean NOT NULL DEFAULT true, "indexed_docs_count" bigint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6f5b901feb7458d7f0ae8e40a0" UNIQUE ("aquila_db_name"), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" BIGSERIAL NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20) NOT NULL, "avatar" character varying(255) NOT NULL, "email" character varying(50) NOT NULL, "desc" character varying(255) NOT NULL, "secret_key" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5f387140f14dda0d07e8c69d94e" UNIQUE ("secret_key"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collection_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(25) NOT NULL, "desc" character varying(255) NOT NULL, "customer_id" uuid NOT NULL, "aquila_db_name" character varying(255) NOT NULL, "is_shereable" boolean NOT NULL DEFAULT true, "indexed_docs_count" bigint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_55a8fd150df3f170c789a81affe" UNIQUE ("aquila_db_name"), CONSTRAINT "PK_658841bdb83ea4263af2e64a683" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" BIGSERIAL NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20) NOT NULL, "avatar" character varying(255) NOT NULL, "desc" character varying(255) NOT NULL, "secret_key" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0754f469522cf14ad9beae89a61" UNIQUE ("secret_key"), CONSTRAINT "PK_0a1542f39ffea6cffd26ce1a731" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customer_temp"`);
        await queryRunner.query(`DROP TABLE "collection_temp"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "collection"`);
    }

}
