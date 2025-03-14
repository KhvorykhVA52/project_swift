import { MigrationInterface, QueryRunner } from "typeorm";

export class AssigneeTaskColumn1740420237723 implements MigrationInterface {
    name = 'AssigneeTaskColumn1740420237723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "status" character varying NOT NULL DEFAULT 'new', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "assigneeId" integer, "authorId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_30cb9d78297c1f2a2e07df1a616" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_30cb9d78297c1f2a2e07df1a616"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`UPDATE "task" SET "assigneeId" = "authorId";`);
    }

}
