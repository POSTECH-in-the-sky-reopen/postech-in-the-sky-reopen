import { Achievement } from "src/entity/Achievement";
import { GroupInfo } from "src/entity/GroupInfo";
import { Honored } from "src/entity/Honored";
import { CoordiItemInfo, DecoCoordiItemInfo, ItemInfo } from "src/entity/ItemInfo";
import { BossMonsterInfo, MonsterInfo } from "src/entity/MonsterInfo";
import { EntityRepository, getConnection, MoreThanOrEqual, Repository, UpdateResult } from "typeorm";
import { AVG_CELL_PER_REGION, Cell } from "src/entity/Cell";
import { AccessoryEquipableItem, EquipableItem, Item, WeaponEquipableItem } from "src/entity/Item";
import { Player, FATIGUE_REFRESH_MONEY, MAX_NUM_EQUIPABLE_INVENTORY_EACH } from "src/entity/Player";
import prepareConnection from "src/lib/db";
import { currentTimestamp } from "src/lib/time";

export const FATIGUE_DECAY_PER_MINUTE = 1

@EntityRepository(Player)
export class PlayerRepository extends Repository<Player> {

    async createAndSave(name: string, achievement: Achievement, honored: Honored, cell: Cell): Promise<Player> {
        const player = new Player()
        player.name = name
        player.achievement = achievement
        player.honored = honored
        player.inventory = []
        player.location = cell
        return this.manager.save(player)
    }

    async updateLocation(player: Player, from: Cell, to: Cell): Promise<UpdateResult> {
        return new Promise((resolve, reject) => {
            this.findOne({
                id: player.id,
                location: from
            }).then(() => {
                resolve(this.update(player.id, {
                    location: to
                }))
            }).catch(() => {
                reject(new Error("셀 이동 중 충돌 발생"))
            })
        })
    }

    async updateFatigue(id: number): Promise<UpdateResult> {
        const cur = currentTimestamp(true)
        return this.createQueryBuilder()
            .update(Player)
            .set({
                fatigue: () => `GREATEST(
                    0, 
                    fatigue
                        - (
                            TIME_TO_SEC(
                                TIMEDIFF(
                                    '${cur}', 
                                    fatigueLastUpdatedAt
                                )
                            )
                            * ${FATIGUE_DECAY_PER_MINUTE}
                            DIV 60
                        )
                )`,
                fatigueLastUpdatedAt: cur,
            })
            .where("id = :id", { id: id })
            .execute()
    }

    async resetFatigue(id: number): Promise<UpdateResult> {
        const cur = currentTimestamp(true)
        return this.createQueryBuilder()
            .update(Player)
            .set({
                fatigue: 0,
                fatigueLastUpdatedAt: cur,
            })
            .where("id = :id", { id: id })
            .execute()
    }

    
    async refreshFatigue(id: number): Promise<UpdateResult> {
        await prepareConnection()
        const cur = currentTimestamp(true)
        return this.createQueryBuilder()
            .update(Player)
            .set({
                money: () => `money - (level DIV ${AVG_CELL_PER_REGION} * ${FATIGUE_REFRESH_MONEY})`,
                fatigue: 0,
                fatigueLastUpdatedAt: cur,
            })
            .where("id = :id", { id: id })
            .andWhere("money >= (level DIV :avg_cell * :required)", { required: FATIGUE_REFRESH_MONEY, avg_cell: AVG_CELL_PER_REGION })
            .execute()
    }

    async incFatigue(id: number, fatigue: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(Player)
            .set({ fatigue: () => `fatigue + ${fatigue} `})
            .where({ id: id })
            .execute();
    }

    async useMoney(id: number, _money: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(Player)
            .set({ money: () => `money - ${_money}` })
            .where({ 
                id: id,
                money: MoreThanOrEqual(_money)
            })
            .execute();
    }

    async earnMoney(id: number, _money: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(Player)
            .set({ money: () => `money + ${_money}` })
            .where({ id: id })
            .execute();
    }

    async getPlayersByGroupInfo(group: GroupInfo): Promise<Player[]>{
        return this.createQueryBuilder('player')
            .leftJoinAndSelect('player.location', 'location')
            .leftJoinAndSelect('player.honored', 'honored')
            .leftJoin('player.group', 'group')
            .where('group.num = :groupNum', { groupNum: group.num })
            .getMany();
    }

    async getPlayersByGroupNum(groupNum: number): Promise<Player[]>{
        return this.createQueryBuilder('player')
            .leftJoin('player.group', 'group')
            .where('group.num = :groupNum', { groupNum: groupNum })
            .getMany();
    }

    async updateLevel(id: number, level: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(Player)
            .set({ level: () => `GREATEST(level, ${level})` })
            .where({ id: id })
            .execute();
    }

    async addItem(id: number, item: Item): Promise<Player> {
        return new Promise((resolve, reject) => {
            this.findOne(id, { relations: ["inventory"] }).then((player) => {
                if (player === undefined) {
                    return reject()
                }
                if (item instanceof EquipableItem) {
                    let equipableCnt = 0
                    if (item instanceof WeaponEquipableItem) {
                        equipableCnt = player.inventory.reduce((cnt, item) => 
                            cnt + ((item instanceof WeaponEquipableItem && item.durability > 0) ? 1 : 0), 0
                        )    
                    } else if (item instanceof AccessoryEquipableItem) {
                        equipableCnt = player.inventory.reduce((cnt, item) => 
                            cnt + ((item instanceof AccessoryEquipableItem && item.durability > 0) ? 1 : 0), 0
                        )
                    }
                    if (equipableCnt < MAX_NUM_EQUIPABLE_INVENTORY_EACH) {
                        player.inventory.push(item)
                        resolve(player.save())
                    } else {
                        reject("인벤토리가 가득 찼습니다.")
                    }
                } else { // just add
                    player.inventory.push(item)
                    resolve(player.save())
                }

            })
        })
    }
    
    async removeItem(id: number, item: Item): Promise<UpdateResult> {
        return await new Promise((resolve, reject) => {
            this.findOne(id, { relations: ["items"] }).then((player) => {
                if (player !== undefined) {
                    let tempItems = []
                    for (let i = 0; i < player.inventory.length; i++) {
                        if (item.id !== player.inventory[i].id) {
                            tempItems.push(player.inventory[i])
                        } else {
                            continue
                        }
                    }
                    return resolve(this.update(id, {
                        inventory: tempItems
                    }))
                } else {
                    reject()
                }
            })
        })
    }

    async addEncounteredItem(playerId: number, itemInfo: ItemInfo) {
        return new Promise((resolve, reject) => {
            this.findOne({ id: playerId }, { relations: ['foundItemInfo'] }).then(async (player) => {
                if (player === undefined) return reject()
                if (player.foundItemInfo === undefined) return reject()
                if (player.foundItemInfo.find(x => x.id === itemInfo.id) !== undefined) {
                    return resolve(false)
                }
                await this.createQueryBuilder()
                    .relation(Player, "foundItemInfo")
                    .of(playerId)
                    .add(itemInfo)
                return resolve(true)
            })
        })
    }


    async addEncounteredMonster(playerId: number, monsterInfo: MonsterInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOne({ id: playerId }, { relations: ['encounteredMonsters'] }).then(player => {
                if (player?.encounteredMonsters.includes(monsterInfo)) {
                    return reject()
                }
                return resolve(this.createQueryBuilder()
                    .relation(Player, "encounteredMonsters")
                    .of(playerId)
                    .add(monsterInfo));
            })

        })
    }


    async addEncounteredBossMonster(playerId: number, bossMonsterInfo: BossMonsterInfo) {
        return new Promise((resolve, reject) => {
            this.findOne({ id: playerId }, { relations: ['encounteredBossMonsters'] }).then(player => {
                if (player?.encounteredBossMonsters.includes(bossMonsterInfo)) {
                    return reject()
                }
                return resolve(this.createQueryBuilder()
                    .relation(Player, "encounteredBossMonsters")
                    .of(playerId)
                    .add(bossMonsterInfo));
            })

        })
    }
}
