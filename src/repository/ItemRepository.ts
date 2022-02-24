import { MAX_DURABILITY } from "src/constants/durability";
import {
    Brackets,
    EntityRepository, LessThan, MoreThan, Repository, UpdateResult
} from "typeorm";
import { AccessoryEquipableItem, CoordiItem, DecoCoordiItem, EnchantItem, EquipableItem, FaceCoordiItem, HairCoordiItem, Item, ITEM_SHARPNESS_INSANE_MAX, SuitCoordiItem, WeaponEquipableItem } from "src/entity/Item";
import { AccessoryEquipableItemInfo, DecoCoordiItemInfo, EnchantItemInfo, EquipableItemInfo, FaceCoordiItemInfo, HairCoordiItemInfo, ItemInfo, SuitCoordiItemInfo, WeaponEquipableItemInfo } from "src/entity/ItemInfo";
import { Player } from "src/entity/Player";
import { ItemType } from "src/enums/ItemType";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {

    async findAllByInventory(player: Player): Promise<Item[]> {
        return new Promise((resolve, reject) => {
            this.findAndCount({
                where: { 
                    player: player,
                    durability: MoreThan(0)
                },
                relations: [ "itemInfo" ]
            }).then(([list, count]) => {
                resolve(list)
            })
        })
    }

    async updateInventory(id: number, player: Player): Promise<UpdateResult> {
        return this.update(id, {
            player: player
        })
    }

    async updateEquipped(id: number, equiped: boolean): Promise<UpdateResult> {
        return this.update(id, { equiped: equiped })
    }

    async findEquiped(playerId: number): Promise<Item[]> {
        return this.find({
            player: { id: playerId },
            equiped: true
        })
    }

    async getCoordiItems(player: Player): Promise<Item[]> {
        return this.createQueryBuilder()
            .where({
                player: { id: player.id }
            }).andWhere( new Brackets(qb=>{
                qb.where({
                    itemType: ItemType.DECO
                }).orWhere({
                    itemType: ItemType.FACE
                }).orWhere({
                    itemType: ItemType.HAIR
                }).orWhere({
                    itemType: ItemType.SUIT
                })
            })).getMany()
    }
}

@EntityRepository(EquipableItem)
export class EquipableItemRepository extends Repository<EquipableItem> {

    async createAndSave(itemInfo: ItemInfo, itemLevel: number, sharpness: number): Promise<EquipableItem> {
        let item: EquipableItem
        if (itemInfo instanceof WeaponEquipableItemInfo) {
            item = new WeaponEquipableItem()
        } else if (itemInfo instanceof AccessoryEquipableItemInfo) {
            item = new AccessoryEquipableItem()
        } else {
            throw new Error("장비 아이템이 아닙니다.")
        }
        item.durability = (itemInfo as EquipableItemInfo).durability
        item.itemType = itemInfo.itemType
        item.itemInfo = itemInfo
        item.level = itemLevel
        item.sharpness = sharpness
        return this.manager.save(item)
    }

    async updateDurability(id: number, durability: number): Promise<UpdateResult> {
        return this.update(id, { durability: durability })
    }

    async decreaseDurability(id: number, turn: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(EquipableItem)
            .set({ durability: () => `GREATEST(durability - ${turn}, 0)` })
            .where({ id: id })
            .execute();
    }

    
    async removeFake(id: number, player: Player): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(EquipableItem)
            .set({
                durability: 0 
            })
            .where({
                id: id,
                player: player
            })
            .execute();
    }


    async repair(id: number): Promise<UpdateResult> {
        return new Promise((resolve, reject) => {
            this.findOne(id, { relations: ["itemInfo"] })
                .then(item => {
                    if (item === undefined) reject("no such item")
                    return (item?.itemInfo as EquipableItemInfo).durability
                })
                .then(maxDurability => {
                    return resolve(this.createQueryBuilder("item")
                        .update(EquipableItem)
                        .set({ 
                            repairCount: () => `repairCount + 1` , 
                            durability: () => `${maxDurability}` 
                        })
                        .where({ id: id })
                        .execute());
                })
        })
    }

    async increaseSharpness(id: number, before: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(EquipableItem)
            .set({
                sharpness: () => `sharpness + 1`
            })
            .where({
                id: id,
                sharpness: before,
            })
            .andWhere({sharpness: LessThan(ITEM_SHARPNESS_INSANE_MAX)})
            .execute();
    }

    async decreaseSharpness(id: number, before: number): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(EquipableItem)
            .set({
                sharpness: () => `sharpness - 1`
            })
            .where({
                id: id,
                sharpness: before,
            })
            .andWhere({sharpness: MoreThan(0)})
            .execute();
    }
}

@EntityRepository(WeaponEquipableItem)
export class WeaponEquipableItemRepository extends Repository<WeaponEquipableItem> {
    async updateEnchant(id: number, enchantItemInfo: EnchantItemInfo): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(WeaponEquipableItem)
            .set({ enchantItemInfo: enchantItemInfo })
            .where({ id: id })
            .execute();
    }
}

@EntityRepository(CoordiItem)
export class CoordiItemRepository extends Repository<CoordiItem> {

    async createAndSave(itemInfo: ItemInfo): Promise<CoordiItem> {
        let item: CoordiItem
        if (itemInfo instanceof HairCoordiItemInfo) {
            item = new HairCoordiItem()
        } else if (itemInfo instanceof FaceCoordiItemInfo) {
            item = new FaceCoordiItem()
        } else if (itemInfo instanceof SuitCoordiItemInfo) {
            item = new SuitCoordiItem()
        } else if (itemInfo instanceof DecoCoordiItemInfo) {
            item = new DecoCoordiItem()
        } else {
            throw new Error("코디 아이템이 아닙니다.")
        }
        item.itemType = itemInfo.itemType
        item.itemInfo = itemInfo
        return this.manager.save(item)
    }

}

@EntityRepository(EnchantItem)
export class EnchantItemRepository extends Repository<EnchantItem> {

    async createAndSave(itemInfo: ItemInfo): Promise<EnchantItem> {
        let item: EnchantItem
        if (itemInfo instanceof EnchantItemInfo) {
            item = new EnchantItem()
        } else {
            throw new Error("인챈트 아이템이 아닙니다.")
        }
        item.itemType = itemInfo.itemType
        item.itemInfo = itemInfo
        return this.manager.save(item)
    }


}
