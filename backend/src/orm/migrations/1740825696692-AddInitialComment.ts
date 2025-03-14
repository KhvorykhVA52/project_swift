import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInitialComment1740825696692 implements MigrationInterface { 

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "comments" ( created_at,comment,grade) VALUES 
            (NOW(), 'Идея выглядит интересно', '9'),
            (NOW(), 'Идея фигня. Описана плохо. Ничего не понятно', '2')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "comments" WHERE grade IN ('9', '2')
        `);
    }

}
