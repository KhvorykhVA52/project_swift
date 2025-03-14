import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInitialPortfolio1740825683956 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "portfolio" ("entryDate", "exclusionDate", "status") VALUES 
            (NOW(), NOW(), 'In the team')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "portfolio" WHERE status IN ('In the team')
        `);
    }

}
