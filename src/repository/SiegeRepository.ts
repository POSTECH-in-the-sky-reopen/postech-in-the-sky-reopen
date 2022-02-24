import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { Siege } from "src/entity/Siege";
import { Cell } from "src/entity/Cell";
import { Player } from "src/entity/Player";

@EntityRepository(Siege)
export class SiegeRepository extends Repository<Siege> {
    async findOneByName(cell: Cell): Promise<Siege> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { cell: cell },
            }).then((siege) => {
                if (siege !== undefined) {
                    resolve(siege);
                } else {
                    reject();
                }
            });
        });
    }

    async findOneById(id: number): Promise<Siege> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { id: id },
            }).then((siege) => {
                if (siege !== undefined) {
                    resolve(siege);
                } else {
                    reject();
                }
            });
        });
    }

    async getCell(id: number): Promise<Cell> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { id: id },
                relations: ["cell"],
            }).then((siege) => {
                if (siege !== undefined) {
                    resolve(siege.cell);
                } else {
                    reject();
                }
            });
        });
    }

    async createAndSave(
        cell: Cell,
        player: Player,
        phase: number,
        damage: number
    ): Promise<Siege> {
        const siege = new Siege();
        siege.cell = cell;
        siege.player = player;
        siege.phase = phase;
        siege.damage = damage;
        return this.manager.save(siege);
    }

    async makeSiege(
        cell: Cell,
        player: Player,
        phase: number,
        newDamage: number
    ): Promise<Siege | UpdateResult> {
        return new Promise((resolve, reject) => {
            this.findOneOrFail({
                cell: cell,
                player: player,
                phase: phase,
            })
                .then((siege) => {
                    {
                        resolve(
                            this.createQueryBuilder()
                                .update(Siege)
                                .set({
                                    damage: () =>
                                        `GREATEST(damage, ${newDamage})`,
                                })
                                .where({ id: siege.id })
                                .execute()
                        );
                    }
                })
                .catch((err) => {
                    this.findOneOrFail({
                        player: player,
                        phase: phase,
                    })
                        .then((siege2) => {
                            resolve(
                                this.createQueryBuilder()
                                    .update(Siege)
                                    .set({
                                        cell: cell,
                                        damage: newDamage,
                                    })
                                    .where({ id: siege2.id })
                                    .execute()
                            );
                        })
                        .catch((err2) => {
                            resolve(
                                this.createAndSave(
                                    cell,
                                    player,
                                    phase,
                                    newDamage
                                )
                            );
                        });
                });
        });
    }

    async makeEnding(
        cell: Cell,
        player: Player,
        phase: number,
        newDamage: number
    ): Promise<Siege> {
        let siege = new Siege()
        siege.cell = cell
        siege.player = player
        siege.phase = phase
        siege.damage = newDamage
        return this.manager.save(siege)
    }
}
