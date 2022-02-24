import {MigrationInterface, QueryRunner} from "typeorm";

export class repairCount1644005444408 implements MigrationInterface {
    name = 'repairCount1644005444408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` ADD \`repairCount\` tinyint NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`repairCount\``);
    }

}