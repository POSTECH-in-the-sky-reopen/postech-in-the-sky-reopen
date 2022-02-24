import {MigrationInterface, QueryRunner} from "typeorm";

export class group1644105293553 implements MigrationInterface {
    name = 'group1644105293553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player\` CHANGE \`group\` \`groupId\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TABLE \`group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`num\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP COLUMN \`group\``);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD \`level\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD \`isTeleportable\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD \`groupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`player\` CHANGE \`level\` \`level\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`player\` DROP COLUMN \`groupId\``);
        await queryRunner.query(`ALTER TABLE \`player\` ADD \`groupId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD CONSTRAINT \`FK_0a18d9fbef0ec79bdb59551ad9a\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD CONSTRAINT \`FK_1b9378be9ba418e227672222cdb\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cell\` DROP FOREIGN KEY \`FK_1b9378be9ba418e227672222cdb\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_0a18d9fbef0ec79bdb59551ad9a\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP COLUMN \`groupId\``);
        await queryRunner.query(`ALTER TABLE \`player\` ADD \`groupId\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`player\` CHANGE \`level\` \`level\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP COLUMN \`groupId\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP COLUMN \`isTeleportable\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP COLUMN \`level\``);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD \`group\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE \`group\``);
        await queryRunner.query(`ALTER TABLE \`player\` CHANGE \`groupId\` \`group\` tinyint NOT NULL DEFAULT '0'`);
    }

}