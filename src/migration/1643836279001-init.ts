import {MigrationInterface, QueryRunner} from "typeorm";

export class init1643836279001 implements MigrationInterface {
    name = 'init1643836279001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`region\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`level\` tinyint NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8d766fc1d4d2e72ecd5f6567a0\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, \`description\` varchar(200) NOT NULL, \`itemType\` tinyint NOT NULL, \`battleType\` tinyint NULL, \`specialized\` tinyint NULL, \`durability\` int NULL, \`enchantSuccess\` int NULL DEFAULT '1', \`onStart\` tinyint NULL DEFAULT 0, \`onTurn\` tinyint NULL DEFAULT 0, \`special\` int NULL DEFAULT '0', \`isChangeBattleType\` tinyint NULL DEFAULT 0, \`startStatus\` text NULL, \`effectStatusToSelf\` text NULL, \`effectStatusToEnemy\` text NULL, \`attackCount\` int NULL DEFAULT '1', \`attackTurn\` int NULL DEFAULT '1', \`isDroppable\` tinyint NULL DEFAULT 1, \`layers\` text NULL, \`type\` varchar(255) NOT NULL, INDEX \`IDX_034a5b682c04c176aff8fd3d24\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`itemType\` tinyint NOT NULL, \`equiped\` tinyint NOT NULL DEFAULT 0, \`level\` tinyint NULL, \`sharpness\` tinyint NULL, \`durability\` int NULL, \`type\` tinyint NOT NULL, \`playerId\` int NULL, \`itemInfoId\` int NULL, \`enchantItemInfoId\` int NULL, INDEX \`IDX_a6c7fa282dcacbfe6247b28f13\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`siege\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phase\` tinyint NOT NULL DEFAULT '0', \`damage\` int NOT NULL DEFAULT '0', \`cellId\` int NULL, \`playerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`player\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, \`group\` tinyint NOT NULL DEFAULT '0', \`level\` int NOT NULL DEFAULT '0', \`money\` int NOT NULL DEFAULT '0', \`fatigue\` int NOT NULL DEFAULT '0', \`fatigueLastUpdatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`locationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cell\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`battleType\` tinyint NOT NULL, \`isCapturable\` tinyint NOT NULL DEFAULT 0, \`ableToBattle\` tinyint NOT NULL DEFAULT 1, \`group\` tinyint NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`regionId\` int NULL, \`adjEastId\` int NULL, \`adjSouthId\` int NULL, UNIQUE INDEX \`IDX_a6e58253eeb12ee08b09d4d797\` (\`name\`), UNIQUE INDEX \`REL_943ff124cea46e9c661ff229d1\` (\`adjEastId\`), UNIQUE INDEX \`REL_b96799cf957466ae58382ac278\` (\`adjSouthId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`monster_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(40) NOT NULL, \`battleType\` tinyint NOT NULL, \`minStatus\` text NOT NULL, \`maxStatus\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`boss_monster_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(40) NOT NULL, \`battleType\` tinyint NOT NULL, \`status\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`phase\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phase\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pin\` char(10) NOT NULL, \`password\` char(60) NOT NULL DEFAULT '', \`name\` varchar(20) NOT NULL, \`email\` varchar(100) NOT NULL DEFAULT '', \`studentId\` int NOT NULL, \`isAdmin\` tinyint NOT NULL DEFAULT 0, \`resetPasswordToken\` varchar(10) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`forgotPasswordAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`playerId\` int NULL, UNIQUE INDEX \`IDX_798cfeabae6730aaf91c3c0463\` (\`pin\`), UNIQUE INDEX \`IDX_2279dce27cfb8d7b0e6e9bbf5c\` (\`studentId\`), UNIQUE INDEX \`IDX_6699b8457beeaf928125b348e8\` (\`resetPasswordToken\`), UNIQUE INDEX \`REL_08df5d6d77f6191e53715afa91\` (\`playerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cell_teleportable_to_cell\` (\`cellId_1\` int NOT NULL, \`cellId_2\` int NOT NULL, INDEX \`IDX_27d79638d8bad9a5a671d93656\` (\`cellId_1\`), INDEX \`IDX_4e1b21ee893a86f16d607e15b7\` (\`cellId_2\`), PRIMARY KEY (\`cellId_1\`, \`cellId_2\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_db17aef71ac2c1e2e6d27ff19e7\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_980a6a75ba89aa9aeedc726afdf\` FOREIGN KEY (\`itemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item\` ADD CONSTRAINT \`FK_4705df119dfd1199874e6a7b444\` FOREIGN KEY (\`enchantItemInfoId\`) REFERENCES \`item_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`siege\` ADD CONSTRAINT \`FK_e327511114b22671571fc0f058e\` FOREIGN KEY (\`cellId\`) REFERENCES \`cell\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`siege\` ADD CONSTRAINT \`FK_ea099cd3b08a199e92110c67dc6\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD CONSTRAINT \`FK_b63425a27db500d89de4f3d4b74\` FOREIGN KEY (\`locationId\`) REFERENCES \`cell\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD CONSTRAINT \`FK_4c5c3a4fe87db66ab6a598f03f1\` FOREIGN KEY (\`regionId\`) REFERENCES \`region\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD CONSTRAINT \`FK_943ff124cea46e9c661ff229d1c\` FOREIGN KEY (\`adjEastId\`) REFERENCES \`cell\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD CONSTRAINT \`FK_b96799cf957466ae58382ac278c\` FOREIGN KEY (\`adjSouthId\`) REFERENCES \`cell\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_08df5d6d77f6191e53715afa910\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cell_teleportable_to_cell\` ADD CONSTRAINT \`FK_27d79638d8bad9a5a671d93656a\` FOREIGN KEY (\`cellId_1\`) REFERENCES \`cell\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cell_teleportable_to_cell\` ADD CONSTRAINT \`FK_4e1b21ee893a86f16d607e15b7b\` FOREIGN KEY (\`cellId_2\`) REFERENCES \`cell\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cell_teleportable_to_cell\` DROP FOREIGN KEY \`FK_4e1b21ee893a86f16d607e15b7b\``);
        await queryRunner.query(`ALTER TABLE \`cell_teleportable_to_cell\` DROP FOREIGN KEY \`FK_27d79638d8bad9a5a671d93656a\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_08df5d6d77f6191e53715afa910\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP FOREIGN KEY \`FK_b96799cf957466ae58382ac278c\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP FOREIGN KEY \`FK_943ff124cea46e9c661ff229d1c\``);
        await queryRunner.query(`ALTER TABLE \`cell\` DROP FOREIGN KEY \`FK_4c5c3a4fe87db66ab6a598f03f1\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_b63425a27db500d89de4f3d4b74\``);
        await queryRunner.query(`ALTER TABLE \`siege\` DROP FOREIGN KEY \`FK_ea099cd3b08a199e92110c67dc6\``);
        await queryRunner.query(`ALTER TABLE \`siege\` DROP FOREIGN KEY \`FK_e327511114b22671571fc0f058e\``);
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_4705df119dfd1199874e6a7b444\``);
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_980a6a75ba89aa9aeedc726afdf\``);
        await queryRunner.query(`ALTER TABLE \`item\` DROP FOREIGN KEY \`FK_db17aef71ac2c1e2e6d27ff19e7\``);
        await queryRunner.query(`DROP INDEX \`IDX_4e1b21ee893a86f16d607e15b7\` ON \`cell_teleportable_to_cell\``);
        await queryRunner.query(`DROP INDEX \`IDX_27d79638d8bad9a5a671d93656\` ON \`cell_teleportable_to_cell\``);
        await queryRunner.query(`DROP TABLE \`cell_teleportable_to_cell\``);
        await queryRunner.query(`DROP INDEX \`REL_08df5d6d77f6191e53715afa91\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_6699b8457beeaf928125b348e8\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_2279dce27cfb8d7b0e6e9bbf5c\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_798cfeabae6730aaf91c3c0463\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`phase\``);
        await queryRunner.query(`DROP TABLE \`boss_monster_info\``);
        await queryRunner.query(`DROP TABLE \`monster_info\``);
        await queryRunner.query(`DROP INDEX \`REL_b96799cf957466ae58382ac278\` ON \`cell\``);
        await queryRunner.query(`DROP INDEX \`REL_943ff124cea46e9c661ff229d1\` ON \`cell\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6e58253eeb12ee08b09d4d797\` ON \`cell\``);
        await queryRunner.query(`DROP TABLE \`cell\``);
        await queryRunner.query(`DROP TABLE \`player\``);
        await queryRunner.query(`DROP TABLE \`siege\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6c7fa282dcacbfe6247b28f13\` ON \`item\``);
        await queryRunner.query(`DROP TABLE \`item\``);
        await queryRunner.query(`DROP INDEX \`IDX_034a5b682c04c176aff8fd3d24\` ON \`item_info\``);
        await queryRunner.query(`DROP TABLE \`item_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d766fc1d4d2e72ecd5f6567a0\` ON \`region\``);
        await queryRunner.query(`DROP TABLE \`region\``);
    }

}