import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1669307306238 implements MigrationInterface {
  name = 'initDb1669307306238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "bio" character varying, "image" character varying, "password" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "description" character varying NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "UQ_0ab85f4be07b22d79906671d72f" UNIQUE ("slug"), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article_favorite_user" ("articleId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_d5df9fb00fdbd0cc2411933dad5" PRIMARY KEY ("articleId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ef1fb440d82a4150b7c658c7a" ON "article_favorite_user" ("articleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c231503c121da39083045880f4" ON "article_favorite_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "article_tags_tag" ("articleId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_25290137c7f85b582eea2bc470d" PRIMARY KEY ("articleId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b7dd28292e2799512cd70bfd8" ON "article_tags_tag" ("articleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fee2a10f8d6688bd2f2c50f15" ON "article_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_favorite_user" ADD CONSTRAINT "FK_7ef1fb440d82a4150b7c658c7a2" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_favorite_user" ADD CONSTRAINT "FK_c231503c121da39083045880f47" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" ADD CONSTRAINT "FK_9b7dd28292e2799512cd70bfd81" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" ADD CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" DROP CONSTRAINT "FK_5fee2a10f8d6688bd2f2c50f15e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_tags_tag" DROP CONSTRAINT "FK_9b7dd28292e2799512cd70bfd81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_favorite_user" DROP CONSTRAINT "FK_c231503c121da39083045880f47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article_favorite_user" DROP CONSTRAINT "FK_7ef1fb440d82a4150b7c658c7a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5fee2a10f8d6688bd2f2c50f15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9b7dd28292e2799512cd70bfd8"`,
    );
    await queryRunner.query(`DROP TABLE "article_tags_tag"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c231503c121da39083045880f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ef1fb440d82a4150b7c658c7a"`,
    );
    await queryRunner.query(`DROP TABLE "article_favorite_user"`);
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
