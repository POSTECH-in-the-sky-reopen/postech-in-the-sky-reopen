import {MigrationInterface, QueryRunner} from "typeorm";

export class isEndingCell1644776807579 implements MigrationInterface {
    name = 'isEndingCell1644776807579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_00a4186ebd513f5a0355eb5e94\` ON \`player\``);
        await queryRunner.query(`DROP INDEX \`IDX_5bf19fe9d8c7bfeb06466277b1\` ON \`player\``);
        await queryRunner.query(`ALTER TABLE \`cell\` ADD \`isEnding\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cell\` DROP COLUMN \`isEnding\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_5bf19fe9d8c7bfeb06466277b1\` ON \`player\` (\`honoredId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_00a4186ebd513f5a0355eb5e94\` ON \`player\` (\`achievementId\`)`);
    }

}
