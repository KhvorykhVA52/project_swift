import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInitialUser1740845651403 implements MigrationInterface {
    name = 'AddInitialUser1740845651403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" (email, "passwordHash",	firstname, lastname, "group", telephone,	roles,	status,	competence,	"teamId") VALUES 
            ('robert@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'Robert', 'Wilson', 'ИСПб-24-1', '79225684392', '{admin}', 'active', '{TypeScript}', NULL),
            ('daniel@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'Daniel', 'Williams', 'ИБКСб-24-1', '79225275801', '{user}', 'pending', '{HTML}', NULL),
            ('john@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'John', 'Thomas', 'АСОиУб-24-1', '79220848224', '{customer}', 'inactive', '{PostgreSQL}', NULL),
            ('william@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'William', 'Ross', 'РППб-24-1', '79224416809', '{expert}', 'inactive', '{PostgreSQL}', NULL),
            ('scott@example.com', '$2b$05$soYIZBdIb9MUmZAa.ThuZeX0AlA42pT8PizmVGfOCqvHuEmxDiujW', 'Scott', 'Ortiz', 'ПКТб-24-1', '79227870709', '{directorate}', 'active', '{TypeScript}', NULL)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE email IN ('robert@example.com', 'daniel@example.com', 'john@example.com', 'william@example.com', 'scott@example.com')
        `);
    }

}
