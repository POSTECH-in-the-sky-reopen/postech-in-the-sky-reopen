import {MigrationInterface, QueryRunner} from "typeorm";

export class collection1644293741822 implements MigrationInterface {
    name = 'collection1644293741822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_0a18d9fbef0ec79bdb59551ad9a\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP FOREIGN KEY \`FK_1b9378be9ba418e227672222cdb\``);
        await queryRunner.query(`CREATE TABLE \`group_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`num\` int NOT NULL, \`collectionMarks\` text NOT NULL, \`enchantSuccess\` int NOT NULL DEFAULT '0', \`equipableDrop\` int NOT NULL DEFAULT '0', \`enchantDrop\` int NOT NULL DEFAULT '0', \`fatigueIncrease\` int NOT NULL DEFAULT '0', \`equipableReinforceSuccess\` int NOT NULL DEFAULT '0', \`equipableReinforceCost\` int NOT NULL DEFAULT '0', \`moneyEarn\` int NOT NULL DEFAULT '0', \`coordiCost\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item_collection\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, \`effectName\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item_collection_groups_group_info\` (\`itemCollectionId\` int NOT NULL, \`groupInfoId\` int NOT NULL, INDEX \`IDX_1c0fce664b36df094fd53241d0\` (\`itemCollectionId\`), INDEX \`IDX_969fad2551e73395d67cbf686f\` (\`groupInfoId\`), PRIMARY KEY (\`itemCollectionId\`, \`groupInfoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item_collection_item_infos_item_info\` (\`itemCollectionId\` int NOT NULL, \`itemInfoId\` int NOT NULL, INDEX \`IDX_ca5742613f060e3dea87021e54\` (\`itemCollectionId\`), INDEX \`IDX_ecaf4924791a9621a9ad154932\` (\`itemInfoId\`), PRIMARY KEY (\`itemCollectionId\`, \`itemInfoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item_info_finders_player\` (\`itemInfoId\` int NOT NULL, \`playerId\` int NOT NULL, INDEX \`IDX_2e94f97a6eefefbce908f2c328\` (\`itemInfoId\`), INDEX \`IDX_d1059f6ed3a9326da1c4c57011\` (\`playerId\`), PRIMARY KEY (\`itemInfoId\`, \`playerId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD CONSTRAINT \`FK_0a18d9fbef0ec79bdb59551ad9a\` FOREIGN KEY (\`groupId\`) REFERENCES \`group_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD CONSTRAINT \`FK_1b9378be9ba418e227672222cdb\` FOREIGN KEY (\`groupId\`) REFERENCES \`group_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_collection_groups_group_info\` ADD CONSTRAINT \`FK_1c0fce664b36df094fd53241d0c\` FOREIGN KEY (\`itemCollectionId\`) REFERENCES \`item_collection\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`item_collection_groups_group_info\` ADD CONSTRAINT \`FK_969fad2551e73395d67cbf686f4\` FOREIGN KEY (\`groupInfoId\`) REFERENCES \`group_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_collection_item_infos_item_info\` ADD CONSTRAINT \`FK_ca5742613f060e3dea87021e549\` FOREIGN KEY (\`itemCollectionId\`) REFERENCES \`item_collection\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`item_collection_item_infos_item_info\` ADD CONSTRAINT \`FK_ecaf4924791a9621a9ad1549322\` FOREIGN KEY (\`itemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` ADD CONSTRAINT \`FK_2e94f97a6eefefbce908f2c328b\` FOREIGN KEY (\`itemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` ADD CONSTRAINT \`FK_d1059f6ed3a9326da1c4c57011e\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` DROP FOREIGN KEY \`FK_d1059f6ed3a9326da1c4c57011e\``);
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` DROP FOREIGN KEY \`FK_2e94f97a6eefefbce908f2c328b\``);
        await queryRunner.query(`ALTER TABLE \`item_collection_item_infos_item_info\` DROP FOREIGN KEY \`FK_ecaf4924791a9621a9ad1549322\``);
        await queryRunner.query(`ALTER TABLE \`item_collection_item_infos_item_info\` DROP FOREIGN KEY \`FK_ca5742613f060e3dea87021e549\``);
        await queryRunner.query(`ALTER TABLE \`item_collection_groups_group_info\` DROP FOREIGN KEY \`FK_969fad2551e73395d67cbf686f4\``);
        await queryRunner.query(`ALTER TABLE \`item_collection_groups_group_info\` DROP FOREIGN KEY \`FK_1c0fce664b36df094fd53241d0c\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP FOREIGN KEY \`FK_1b9378be9ba418e227672222cdb\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_0a18d9fbef0ec79bdb59551ad9a\``);
        await queryRunner.query(`DROP INDEX \`IDX_d1059f6ed3a9326da1c4c57011\` ON \`item_info_finders_player\``);
        await queryRunner.query(`DROP INDEX \`IDX_2e94f97a6eefefbce908f2c328\` ON \`item_info_finders_player\``);
        await queryRunner.query(`DROP TABLE \`item_info_finders_player\``);
        await queryRunner.query(`DROP INDEX \`IDX_ecaf4924791a9621a9ad154932\` ON \`item_collection_item_infos_item_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_ca5742613f060e3dea87021e54\` ON \`item_collection_item_infos_item_info\``);
        await queryRunner.query(`DROP TABLE \`item_collection_item_infos_item_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_969fad2551e73395d67cbf686f\` ON \`item_collection_groups_group_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_1c0fce664b36df094fd53241d0\` ON \`item_collection_groups_group_info\``);
        await queryRunner.query(`DROP TABLE \`item_collection_groups_group_info\``);
        await queryRunner.query(`DROP TABLE \`item_collection\``);
        await queryRunner.query(`DROP TABLE \`group_info\``);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD CONSTRAINT \`FK_1b9378be9ba418e227672222cdb\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD CONSTRAINT \`FK_0a18d9fbef0ec79bdb59551ad9a\` FOREIGN KEY (\`groupId\`) REFERENCES \`group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}