import {MigrationInterface, QueryRunner} from "typeorm";

export class signUpEmail1646753810517 implements MigrationInterface {
    name = 'signUpEmail1646753810517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_798cfeabae6730aaf91c3c0463\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pin\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`confirmEmailToken\` varchar(30) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_4007f003f9899ca1c146097eff\` (\`confirmEmailToken\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`povisId\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_1aac8cb5930e20bc129f66d858\` (\`povisId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` char(60) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_6699b8457beeaf928125b348e8\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetPasswordToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetPasswordToken\` varchar(30) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_6699b8457beeaf928125b348e8\` (\`resetPasswordToken\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_0d3cf24ca872ea81eb0e282864\` ON \`item_info\``);
        await queryRunner.query(`ALTER TABLE \`item_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`item_info\` ADD \`silhouetteId\` char(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`item_info\` ADD UNIQUE INDEX \`IDX_0d3cf24ca872ea81eb0e282864\` (\`silhouetteId\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_3d6fc93995d91d2ab3ba1f0a92\` ON \`monster_info\``);
        await queryRunner.query(`ALTER TABLE \`monster_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`monster_info\` ADD \`silhouetteId\` char(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`monster_info\` ADD UNIQUE INDEX \`IDX_3d6fc93995d91d2ab3ba1f0a92\` (\`silhouetteId\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_d7450df2a0591e49f57141d4dd\` ON \`boss_monster_info\``);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` ADD \`silhouetteId\` char(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` ADD UNIQUE INDEX \`IDX_d7450df2a0591e49f57141d4dd\` (\`silhouetteId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` DROP INDEX \`IDX_d7450df2a0591e49f57141d4dd\``);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` ADD \`silhouetteId\` char(10) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d7450df2a0591e49f57141d4dd\` ON \`boss_monster_info\` (\`silhouetteId\`)`);
        await queryRunner.query(`ALTER TABLE \`monster_info\` DROP INDEX \`IDX_3d6fc93995d91d2ab3ba1f0a92\``);
        await queryRunner.query(`ALTER TABLE \`monster_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`monster_info\` ADD \`silhouetteId\` char(10) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_3d6fc93995d91d2ab3ba1f0a92\` ON \`monster_info\` (\`silhouetteId\`)`);
        await queryRunner.query(`ALTER TABLE \`item_info\` DROP INDEX \`IDX_0d3cf24ca872ea81eb0e282864\``);
        await queryRunner.query(`ALTER TABLE \`item_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`item_info\` ADD \`silhouetteId\` char(10) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0d3cf24ca872ea81eb0e282864\` ON \`item_info\` (\`silhouetteId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_6699b8457beeaf928125b348e8\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`resetPasswordToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`resetPasswordToken\` varchar(10) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6699b8457beeaf928125b348e8\` ON \`user\` (\`resetPasswordToken\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` char(60) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_1aac8cb5930e20bc129f66d858\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`povisId\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_4007f003f9899ca1c146097eff\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`confirmEmailToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pin\` char(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_798cfeabae6730aaf91c3c0463\` ON \`user\` (\`pin\`)`);
    }

}