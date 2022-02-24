import {MigrationInterface, QueryRunner} from "typeorm";

export class foundItem1644326975875 implements MigrationInterface {
    name = 'foundItem1644326975875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`player_found_item_info_item_info\` (\`playerId\` int NOT NULL, \`itemInfoId\` int NOT NULL, INDEX \`IDX_5a2ba292f0185c3d8861e8c01e\` (\`playerId\`), INDEX \`IDX_2007b006ecee52351d229430eb\` (\`itemInfoId\`), PRIMARY KEY (\`playerId\`, \`itemInfoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`item_collection\` DROP COLUMN \`effectName\``);
        await queryRunner.query(`ALTER TABLE \`item_info\` ADD \`silhouetteId\` char(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`item_info\` ADD UNIQUE INDEX \`IDX_0d3cf24ca872ea81eb0e282864\` (\`silhouetteId\`)`);
        await queryRunner.query(`ALTER TABLE \`item_collection\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`item_collection\` ADD \`name\` varchar(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` ADD CONSTRAINT \`FK_5a2ba292f0185c3d8861e8c01e9\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` ADD CONSTRAINT \`FK_2007b006ecee52351d229430eb6\` FOREIGN KEY (\`itemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` DROP FOREIGN KEY \`FK_2007b006ecee52351d229430eb6\``);
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` DROP FOREIGN KEY \`FK_5a2ba292f0185c3d8861e8c01e9\``);
        await queryRunner.query(`ALTER TABLE \`item_collection\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`item_collection\` ADD \`name\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`item_info\` DROP INDEX \`IDX_0d3cf24ca872ea81eb0e282864\``);
        await queryRunner.query(`ALTER TABLE \`item_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`item_collection\` ADD \`effectName\` varchar(20) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_2007b006ecee52351d229430eb\` ON \`player_found_item_info_item_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a2ba292f0185c3d8861e8c01e\` ON \`player_found_item_info_item_info\``);
        await queryRunner.query(`DROP TABLE \`player_found_item_info_item_info\``);
    }

}