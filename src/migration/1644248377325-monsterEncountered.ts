import {MigrationInterface, QueryRunner} from "typeorm";

export class monsterEncountered1644248436379 implements MigrationInterface {
    name = 'monsterEncountered1644248436379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`player_encountered_monsters_monster_info\` (\`playerId\` int NOT NULL, \`monsterInfoId\` int NOT NULL, INDEX \`IDX_304ed07d5fb7ec052ce9ef3a4a\` (\`playerId\`), INDEX \`IDX_0fa71db12be39ff32cc179b904\` (\`monsterInfoId\`), PRIMARY KEY (\`playerId\`, \`monsterInfoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`player_encountered_boss_monsters_boss_monster_info\` (\`playerId\` int NOT NULL, \`bossMonsterInfoId\` int NOT NULL, INDEX \`IDX_da0adbc1086481ea775b355b3a\` (\`playerId\`), INDEX \`IDX_dffdc85d39f5516b05846b0c53\` (\`bossMonsterInfoId\`), PRIMARY KEY (\`playerId\`, \`bossMonsterInfoId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`monster_info\` ADD \`silhouetteId\` char(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`monster_info\` ADD UNIQUE INDEX \`IDX_3d6fc93995d91d2ab3ba1f0a92\` (\`silhouetteId\`)`);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` ADD \`silhouetteId\` char(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` ADD UNIQUE INDEX \`IDX_d7450df2a0591e49f57141d4dd\` (\`silhouetteId\`)`);
        await queryRunner.query(`ALTER TABLE \`player_encountered_monsters_monster_info\` ADD CONSTRAINT \`FK_304ed07d5fb7ec052ce9ef3a4ad\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`player_encountered_monsters_monster_info\` ADD CONSTRAINT \`FK_0fa71db12be39ff32cc179b9041\` FOREIGN KEY (\`monsterInfoId\`) REFERENCES \`monster_info\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`player_encountered_boss_monsters_boss_monster_info\` ADD CONSTRAINT \`FK_da0adbc1086481ea775b355b3a7\` FOREIGN KEY (\`playerId\`) REFERENCES \`player\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`player_encountered_boss_monsters_boss_monster_info\` ADD CONSTRAINT \`FK_dffdc85d39f5516b05846b0c535\` FOREIGN KEY (\`bossMonsterInfoId\`) REFERENCES \`boss_monster_info\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`player_encountered_boss_monsters_boss_monster_info\` DROP FOREIGN KEY \`FK_dffdc85d39f5516b05846b0c535\``);
        await queryRunner.query(`ALTER TABLE \`player_encountered_boss_monsters_boss_monster_info\` DROP FOREIGN KEY \`FK_da0adbc1086481ea775b355b3a7\``);
        await queryRunner.query(`ALTER TABLE \`player_encountered_monsters_monster_info\` DROP FOREIGN KEY \`FK_0fa71db12be39ff32cc179b9041\``);
        await queryRunner.query(`ALTER TABLE \`player_encountered_monsters_monster_info\` DROP FOREIGN KEY \`FK_304ed07d5fb7ec052ce9ef3a4ad\``);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` DROP INDEX \`IDX_d7450df2a0591e49f57141d4dd\``);
        await queryRunner.query(`ALTER TABLE \`boss_monster_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`ALTER TABLE \`monster_info\` DROP INDEX \`IDX_3d6fc93995d91d2ab3ba1f0a92\``);
        await queryRunner.query(`ALTER TABLE \`monster_info\` DROP COLUMN \`silhouetteId\``);
        await queryRunner.query(`DROP INDEX \`IDX_dffdc85d39f5516b05846b0c53\` ON \`player_encountered_boss_monsters_boss_monster_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_da0adbc1086481ea775b355b3a\` ON \`player_encountered_boss_monsters_boss_monster_info\``);
        await queryRunner.query(`DROP TABLE \`player_encountered_boss_monsters_boss_monster_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_0fa71db12be39ff32cc179b904\` ON \`player_encountered_monsters_monster_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_304ed07d5fb7ec052ce9ef3a4a\` ON \`player_encountered_monsters_monster_info\``);
        await queryRunner.query(`DROP TABLE \`player_encountered_monsters_monster_info\``);
    }

}