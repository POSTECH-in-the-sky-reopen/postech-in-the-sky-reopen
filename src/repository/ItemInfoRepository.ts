import { GroupInfo } from "src/entity/GroupInfo";
import { Player } from "src/entity/Player";
import { createPin } from "src/util/Pin";
import { EntityRepository, Repository, UpdateResult } from "typeorm";
import {
    ItemInfo,
    EquipableItemInfo, WeaponEquipableItemInfo, AccessoryEquipableItemInfo,
    CoordiItemInfo, FaceCoordiItemInfo, HairCoordiItemInfo, SuitCoordiItemInfo,
    EnchantItemInfo,
    DecoCoordiItemInfo
} from 'src/entity/ItemInfo'
import { BattleType } from "src/enums/BattleType";
import { ItemType, Layer, Specialized } from "src/enums/ItemType";
import { Status } from "src/interfaces/Status";

@EntityRepository(ItemInfo)
export class ItemInfoRepository extends Repository<ItemInfo> {

    async findOneById(id: number): Promise<ItemInfo> {
        return new Promise((resolve, reject) => {
            this.findOne(id).then(itemInfo => {
                if (itemInfo !== undefined) {
                    resolve(itemInfo)
                } else {
                    reject()
                }
            })
        })
    }

    async findOneByName(name: string): Promise<ItemInfo> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { name: name }
            }).then(itemInfo => {
                if (itemInfo !== undefined) {
                    resolve(itemInfo)
                } else {
                    reject()
                }
            })
        })
    }

    async assureNonexistByName(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.findOneByName(name)
                .then(itemInfo => {
                    reject()
                })
                .catch(err => {
                    resolve()
                })
        })
    }
}


@EntityRepository(EquipableItemInfo)
export class EquipableItemInfoRepository extends Repository<EquipableItemInfo> {

    async createAndSave(
        name: string,
        description: string,
        itemType: ItemType,
        specialized: Specialized,
        battleType: BattleType,
        durability: number
    ): Promise<EquipableItemInfo> {

        let itemInfo: EquipableItemInfo | undefined = undefined
        if (itemType === ItemType.WEAPON) {
            itemInfo = new WeaponEquipableItemInfo()
        }
        else if (itemType === ItemType.ACCESSORY) {
            itemInfo = new AccessoryEquipableItemInfo()
        }
        if (itemInfo === undefined) throw new Error()

        itemInfo.name = name
        itemInfo.finders = []
        itemInfo.description = description
        itemInfo.itemType = itemType
        itemInfo.specialized = specialized
        itemInfo.battleType = battleType
        itemInfo.durability = durability
        itemInfo.silhouetteId = createPin()
        return this.manager.save(itemInfo)
    }
    
    async findOneRandom(battleType: BattleType) {
        return this.createQueryBuilder()
            .where("battleType = :type", { type: battleType })
            .andWhere(`durability < ${10000}`)
            .orderBy("RAND()")
            .getOneOrFail()
    }

    async updateAll(
        name: string,
        description: string,
        itemType: ItemType,
        specialized: Specialized,
        battleType: BattleType,
        durability: number
    ): Promise<UpdateResult> {

        return this.createQueryBuilder()
            .update(EquipableItemInfo)
            .set({
                description: description,
                itemType: itemType,
                specialized: specialized,
                battleType: battleType,
                durability: durability,
            })
            .where({ name: name })
            .execute()
    }

}

@EntityRepository(CoordiItemInfo)
export class CoordiItemInfoRepository extends Repository<CoordiItemInfo> {

    async createAndSave(
        name: string,
        description: string,
        itemType: ItemType,
        layers: Layer[],
    ): Promise<CoordiItemInfo> {

        let itemInfo: CoordiItemInfo | undefined = undefined
        if (itemType === ItemType.FACE) {
            itemInfo = new FaceCoordiItemInfo()
        }
        else if (itemType === ItemType.HAIR) {
            itemInfo = new HairCoordiItemInfo()
        }
        else if (itemType === ItemType.SUIT) {
            itemInfo = new SuitCoordiItemInfo()
        }
        else if (itemType === ItemType.DECO) {
            itemInfo = new DecoCoordiItemInfo()
        }
        if (itemInfo === undefined) throw new Error()

        itemInfo.layers = layers
        itemInfo.name = name
        itemInfo.finders = []
        itemInfo.description = description
        itemInfo.itemType = itemType
        itemInfo.silhouetteId = createPin()
        return this.manager.save(itemInfo)
    }
}

@EntityRepository(EnchantItemInfo)
export class EnchantItemInfoRepository extends Repository<EnchantItemInfo> {

    async createAndSave(
        name: string,
        description: string,
        itemType: ItemType,
        enchantSuccess: number,
        onStart: boolean,
        onTurn: boolean,
        special: number,
        isChangeBattleType: boolean,
        battleType: BattleType,
        startStatus: Status,
        effectStatusToSelf: Status,
        effectStatusToEnemy: Status,
        attackCount: number,
        attackTurn: number,
        isDroppable: boolean,
    ): Promise<EnchantItemInfo> {

        const itemInfo = new EnchantItemInfo()
        itemInfo.name = name
        itemInfo.description = description
        itemInfo.itemType = itemType
        itemInfo.enchantSuccess = enchantSuccess
        itemInfo.itemType = ItemType.ENCHANT
        itemInfo.onStart = onStart
        itemInfo.onTurn = onTurn
        itemInfo.special = special
        itemInfo.isChangeBattleType = isChangeBattleType
        itemInfo.battleType = battleType
        itemInfo.startStatus = startStatus
        itemInfo.effectStatusToSelf = effectStatusToSelf
        itemInfo.effectStatusToEnemy = effectStatusToEnemy
        itemInfo.attackCount = attackCount
        itemInfo.attackTurn = attackTurn
        itemInfo.isDroppable = isDroppable
        itemInfo.finders = []
        itemInfo.silhouetteId = createPin()

        return this.manager.save(itemInfo)
    }

    async findDroppableOneRandom() {
        return this.createQueryBuilder()
            .orderBy("RAND()")
            .where({ isDroppable: true })
            .getOneOrFail()
    }


    async updateAll(
        name: string,
        description: string,
        itemType: ItemType,
        enchantSuccess: number,
        onStart: boolean,
        onTurn: boolean,
        special: number,
        isChangeBattleType: boolean,
        battleType: BattleType,
        startStatus: Status,
        effectStatusToSelf: Status,
        effectStatusToEnemy: Status,
        attackCount: number,
        attackTurn: number,
        isDroppable: boolean,
    ): Promise<UpdateResult> {

        return this.createQueryBuilder()
            .update(EnchantItemInfo)
            .set({
                description: description,
                itemType: itemType,
                enchantSuccess: enchantSuccess,
                onStart: onStart,
                onTurn: onTurn,
                special: special,
                isChangeBattleType: isChangeBattleType,
                battleType: battleType,
                startStatus: startStatus,
                effectStatusToSelf: effectStatusToSelf,
                effectStatusToEnemy: effectStatusToEnemy,
                attackCount: attackCount,
                attackTurn: attackTurn,
                isDroppable: isDroppable,
            })
            .where({ name: name })
            .execute()
    }

}
