import { createPin } from "src/util/Pin"
import { EntityRepository, Repository } from "typeorm"
import { BossMonsterInfo, MonsterInfo } from "src/entity/MonsterInfo"
import { BattleType } from "src/enums/BattleType"
import { Status } from "src/interfaces/Status"

@EntityRepository(MonsterInfo)
export class MonsterInfoRepository extends Repository<MonsterInfo> {

    async findOneById(id: number): Promise<MonsterInfo> {
        return new Promise((resolve, reject) => {
            this.findOne(id).then(monsterInfo => {
                if (monsterInfo !== undefined) {
                    resolve(monsterInfo)
                } else {
                    reject()
                }
            })
        })
    }

    async findOneByName(name: string): Promise<MonsterInfo> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { name: name }
            }).then(monsterInfo => {
                if (monsterInfo !== undefined) {
                    resolve(monsterInfo)
                } else {
                    reject()
                }
            })
        })
    }

    async findOneRandom(battleType: BattleType) {
        return this.createQueryBuilder()
            .where("battleType = :type", { type: battleType })
            .orderBy("RAND()")
            .getOneOrFail()
    }

    async assureNonexistByName(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOneByName(name)
                .then(monsterInfo => {
                    reject()
                })
                .catch(err => {
                    resolve()
                })
        })
    }


    async createAndSave(
        name: string,
        battleType: BattleType,
        minStatus: Status,
        maxStatus: Status
    ): Promise<MonsterInfo> {
        let monsterInfo = new MonsterInfo()
        monsterInfo.name = name
        monsterInfo.battleType = battleType
        monsterInfo.minStatus = {
            "attack": minStatus.attack,
            "defense": minStatus.defense,
            "hpmax": minStatus.hpmax,
            "luck": minStatus.luck
        }
        monsterInfo.maxStatus = {
            "attack": maxStatus.attack,
            "defense": maxStatus.defense,
            "hpmax": maxStatus.hpmax,
            "luck": maxStatus.luck
        }
        monsterInfo.silhouetteId = createPin()
        return this.manager.save(monsterInfo)
    }

}


@EntityRepository(BossMonsterInfo)
export class BossMonsterInfoRepository extends Repository<BossMonsterInfo> {

    async findOneById(id: number): Promise<BossMonsterInfo> {
        return new Promise((resolve, reject) => {
            this.findOne(id).then(monsterInfo => {
                if (monsterInfo !== undefined) {
                    resolve(monsterInfo)
                } else {
                    reject()
                }
            })
        })
    }

    async findOneByName(name: string): Promise<BossMonsterInfo> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { name: name }
            }).then(monsterInfo => {
                if (monsterInfo !== undefined) {
                    resolve(monsterInfo)
                } else {
                    reject()
                }
            })
        })
    }

    async getOne(battleType: BattleType) {
        return this.createQueryBuilder()
            .where("battleType = :type", { type: battleType })
            .getOneOrFail()
    }

    async assureNonexistByName(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOneByName(name)
                .then(monsterInfo => {
                    reject()
                })
                .catch(err => {
                    resolve()
                })
        })
    }

    async createAndSave(
        name: string,
        battleType: BattleType,
        status: Status,
    ): Promise<BossMonsterInfo> {
        let monsterInfo = new BossMonsterInfo()
        monsterInfo.name = name
        monsterInfo.battleType = battleType
        monsterInfo.status = {
            "attack": status.attack,
            "defense": status.defense,
            "hpmax": status.hpmax,
            "luck": status.luck
        }
        monsterInfo.silhouetteId = createPin()
        return this.manager.save(monsterInfo)
    }

}
