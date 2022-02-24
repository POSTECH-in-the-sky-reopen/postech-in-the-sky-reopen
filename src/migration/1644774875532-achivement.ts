import {MigrationInterface, QueryRunner} from "typeorm";

export class achivement1644774875532 implements MigrationInterface {
    name = 'achivement1644774875532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`honored\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level\` int NOT NULL DEFAULT '0', \`items\` text NOT NULL, \`moneyUsed\` int NOT NULL DEFAULT '0', \`honoredInd\` int NOT NULL DEFAULT '0', \`names\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`achievement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`wholeBossDamage\` int NOT NULL DEFAULT '0', \`moneyUsed\` int NOT NULL DEFAULT '0', \`loseCount\` int NOT NULL DEFAULT '0', \`maxDamage\` int NOT NULL DEFAULT '0', \`maxTurn\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD \`honoredId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD UNIQUE INDEX \`IDX_5bf19fe9d8c7bfeb06466277b1\` (\`honoredId\`)`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD \`achievementId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD UNIQUE INDEX \`IDX_00a4186ebd513f5a0355eb5e94\` (\`achievementId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_5bf19fe9d8c7bfeb06466277b1\` ON \`player\` (\`honoredId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_00a4186ebd513f5a0355eb5e94\` ON \`player\` (\`achievementId\`)`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD CONSTRAINT \`FK_5bf19fe9d8c7bfeb06466277b12\` FOREIGN KEY (\`honoredId\`) REFERENCES \`honored\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`player\` ADD CONSTRAINT \`FK_00a4186ebd513f5a0355eb5e942\` FOREIGN KEY (\`achievementId\`) REFERENCES \`achievement\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_00a4186ebd513f5a0355eb5e942\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP FOREIGN KEY \`FK_5bf19fe9d8c7bfeb06466277b12\``);
        await queryRunner.query(`DROP INDEX \`REL_00a4186ebd513f5a0355eb5e94\` ON \`player\``);
        await queryRunner.query(`DROP INDEX \`REL_5bf19fe9d8c7bfeb06466277b1\` ON \`player\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP INDEX \`IDX_00a4186ebd513f5a0355eb5e94\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP COLUMN \`achievementId\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP INDEX \`IDX_5bf19fe9d8c7bfeb06466277b1\``);
        await queryRunner.query(`ALTER TABLE \`player\` DROP COLUMN \`honoredId\``);
        await queryRunner.query(`DROP TABLE \`achievement\``);
        await queryRunner.query(`DROP TABLE \`honored\``);
    }

}
