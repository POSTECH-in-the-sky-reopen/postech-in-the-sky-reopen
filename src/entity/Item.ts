import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,  ManyToOne, JoinColumn, TableInheritance, ChildEntity } from 'typeorm'
import { ItemType, sharpnessDiff, Specialized } from '../enums/ItemType'
import { Status } from '../interfaces/Status'
import { EnchantItemInfo, ItemInfo } from './ItemInfo'
import { Player } from './Player'

export const BASE_STATUS = {attack: 200, defense: 200, hpmax: 500, luck: 0}
export const ITEM_STATUS_EXP_BASE_PLUS = 2
export const ITEM_STATUS_EXP_BASE_MINUS = 1.5
export const ITEM_SHARPNESS_REASONABLE_MAX = 10
export const ITEM_SHARPNESS_INSANE_MAX = 20
export const ITEM_SHARPNESS_INSANE_BONUS_MUL = 3
export const ITEM_SHARPNESS_GRIND_COST = [ 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 50, 50, 50, 50, 50, 100, 100, 100, 100, 100]
export const ITEM_SHARPNESS_GRIND_RATE: Array<{[key in sharpnessDiff] : number}> = [
    { [sharpnessDiff.SUCCESS]: 90 as const, [sharpnessDiff.SAME]: 10 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 80 as const, [sharpnessDiff.SAME]: 20 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 70 as const, [sharpnessDiff.SAME]: 30 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 60 as const, [sharpnessDiff.SAME]: 40 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 50 as const, [sharpnessDiff.SAME]: 50 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 40 as const, [sharpnessDiff.SAME]: 60 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 30 as const, [sharpnessDiff.SAME]: 50 as const, [sharpnessDiff.FAIL]: 20 as const } as const,
    { [sharpnessDiff.SUCCESS]: 30 as const, [sharpnessDiff.SAME]:  0 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]: 30 as const, [sharpnessDiff.SAME]:  0 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]: 30 as const, [sharpnessDiff.SAME]:  0 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]:  5 as const, [sharpnessDiff.SAME]: 95 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]:  4 as const, [sharpnessDiff.SAME]: 96 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]:  3 as const, [sharpnessDiff.SAME]: 97 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]:  2 as const, [sharpnessDiff.SAME]: 98 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]:  1 as const, [sharpnessDiff.SAME]: 99 as const, [sharpnessDiff.FAIL]:  0 as const } as const,
    { [sharpnessDiff.SUCCESS]: 20 as const, [sharpnessDiff.SAME]: 10 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]: 15 as const, [sharpnessDiff.SAME]: 15 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]: 10 as const, [sharpnessDiff.SAME]: 20 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]:  5 as const, [sharpnessDiff.SAME]: 25 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
    { [sharpnessDiff.SUCCESS]:  3 as const, [sharpnessDiff.SAME]: 27 as const, [sharpnessDiff.FAIL]: 70 as const } as const,
]
export const ITEM_WEAPON_STATUS_MIN_PER_SPECIALIZED: { [key in Specialized] : Status } = {
    [Specialized.DEFAULT]: {attack: 10, defense: 10, hpmax: 50, luck: 0},
    [Specialized.BALANCED]: {attack: 100, defense: 100, hpmax: 300, luck: 20},
    [Specialized.SPECIAL]: {attack: 160, defense: 40, hpmax: 300, luck: 15},
    [Specialized.EXTREME_SPECIAL]: {attack: 200, defense: 0, hpmax: 300, luck: 15},
    [Specialized.REVERSED]: {attack: 60, defense: 140, hpmax: 500, luck: 20},
    [Specialized.LUCK]: {attack: 80, defense: 80, hpmax: 200, luck: 50}
}
export const ITEM_WEAPON_STATUS_MAX_PER_SPECIALIZED: { [key in Specialized] : Status } = {
    [Specialized.DEFAULT]: {attack: 10, defense: 10, hpmax: 50, luck: 0},
    [Specialized.BALANCED]: {attack: 180, defense: 180, hpmax: 300, luck: 20},
    [Specialized.SPECIAL]: {attack: 240, defense: 120, hpmax: 300, luck: 15},
    [Specialized.EXTREME_SPECIAL]: {attack: 280, defense: 80, hpmax: 300, luck: 15},
    [Specialized.REVERSED]: {attack: 140, defense: 220, hpmax: 500, luck: 20},
    [Specialized.LUCK]: {attack: 160, defense: 160, hpmax: 200, luck: 50},
}

export const ITEM_ACCESSORY_STATUS_MIN_PER_SPECIALIZED: { [key in Specialized] : Status } = {
    [Specialized.DEFAULT]: {attack: 10, defense: 10, hpmax: 50, luck: 0},
    [Specialized.BALANCED]: {attack: 50, defense: 150, hpmax: 500, luck: 10},
    [Specialized.SPECIAL]: {attack: 20, defense: 180, hpmax: 750, luck: 0},
    [Specialized.EXTREME_SPECIAL]: {attack: 0, defense: 200, hpmax: 1000, luck: 0},
    [Specialized.REVERSED]: {attack: 100, defense: 100, hpmax: 300, luck: 20},
    [Specialized.LUCK]: {attack: 30, defense: 130, hpmax: 500, luck: 50},
}
export const ITEM_ACCESSORY_STATUS_MAX_PER_SPECIALIZED: { [key in Specialized] : Status } = {
    [Specialized.DEFAULT]: {attack: 10, defense: 10, hpmax: 50, luck: 0},
    [Specialized.BALANCED]: {attack: 90, defense: 190, hpmax: 500, luck: 10},
    [Specialized.SPECIAL]: {attack: 60, defense: 220, hpmax: 750, luck: 0},
    [Specialized.EXTREME_SPECIAL]: {attack: 40, defense: 240, hpmax: 1000, luck: 0},
    [Specialized.REVERSED]: {attack: 140, defense: 140, hpmax: 300, luck: 20},
    [Specialized.LUCK]: {attack: 70, defense: 170, hpmax: 500, luck: 50},
}

@Entity()
@TableInheritance({ column: { type: 'tinyint', name: 'type' } })
export abstract class Item extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Player, Player => Player.inventory, {
        onDelete: 'CASCADE'
    })
    player: Player
    
    @Column('tinyint')
    itemType: ItemType
    
    @ManyToOne(type => ItemInfo, itemInfo => itemInfo.items, {
        eager: true,
        onDelete: 'RESTRICT',
    })
    itemInfo: ItemInfo
    
    @Column('boolean',{
        default: false
    })
    equiped: boolean    
    
}

@ChildEntity()
export abstract class EquipableItem extends Item {
    @Column('tinyint')
    level: number

    @Column('tinyint')
    sharpness: number

    @Column('int')
    durability: number

    @Column('tinyint',
    {
        default: 0
    })
    repairCount: number
}

@ChildEntity(ItemType.WEAPON)
export class WeaponEquipableItem extends EquipableItem {

    @ManyToOne(type => EnchantItemInfo, enchantItemInfo => enchantItemInfo.items)
    @JoinColumn()
    enchantItemInfo: EnchantItemInfo

}

@ChildEntity(ItemType.ACCESSORY)
export class AccessoryEquipableItem extends EquipableItem {

}

@ChildEntity()
export abstract class CoordiItem extends Item {
    
}

@ChildEntity(ItemType.ENCHANT)
export class EnchantItem extends Item { 

}

@ChildEntity(ItemType.FACE)
export class FaceCoordiItem extends CoordiItem {

}

@ChildEntity(ItemType.HAIR)
export class HairCoordiItem extends CoordiItem {

}

@ChildEntity(ItemType.SUIT)
export class SuitCoordiItem extends CoordiItem {

}

@ChildEntity(ItemType.DECO)
export class DecoCoordiItem extends CoordiItem {

}
