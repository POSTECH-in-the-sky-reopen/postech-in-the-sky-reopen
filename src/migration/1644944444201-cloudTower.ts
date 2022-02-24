import {MigrationInterface, QueryRunner} from "typeorm";

export class cloudTower1644944444201 implements MigrationInterface {
    name = 'cloudTower1644944444201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`honored\` ADD \`cloudTowerFloor\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`achievement\` ADD \`cloudTowerFloor\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`achievement\` DROP COLUMN \`cloudTowerFloor\``);
        await queryRunner.query(`ALTER TABLE \`honored\` DROP COLUMN \`cloudTowerFloor\``);
    }

}