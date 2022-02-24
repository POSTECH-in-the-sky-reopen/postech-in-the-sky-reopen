import {MigrationInterface, QueryRunner} from "typeorm";

export class itemPlayer1644781532656 implements MigrationInterface {
    name = 'itemPlayer1644781532656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` DROP FOREIGN KEY \`FK_d1059f6ed3a9326da1c4c57011e\``);
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` DROP FOREIGN KEY \`FK_2007b006ecee52351d229430eb6\``);
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` ADD CONSTRAINT \`FK_d1059f6ed3a9326da1c4c57011e\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` ADD CONSTRAINT \`FK_2007b006ecee52351d229430eb6\` FOREIGN KEY (\`itemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` DROP FOREIGN KEY \`FK_2007b006ecee52351d229430eb6\``);
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` DROP FOREIGN KEY \`FK_d1059f6ed3a9326da1c4c57011e\``);
        await queryRunner.query(`ALTER TABLE \`player_found_item_info_item_info\` ADD CONSTRAINT \`FK_2007b006ecee52351d229430eb6\` FOREIGN KEY (\`itemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_info_finders_player\` ADD CONSTRAINT \`FK_d1059f6ed3a9326da1c4c57011e\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
