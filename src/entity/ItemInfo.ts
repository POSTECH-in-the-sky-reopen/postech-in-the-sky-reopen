import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, TableInheritance, ChildEntity, ManyToMany, JoinTable } from 'typeorm'
import { BattleType } from '../enums/BattleType'
import { ItemType, Layer, Specialized } from '../enums/ItemType'
import { Item } from './Item'
import { ItemCollection } from './ItemCollection'
import { Player } from './Player'
import { NANOID_LENGTH } from './User'
export const MAX_ITEMINFO_NAME_LENGTH = 20
export const MAX_ITEMINFO_DESCRIPTION_LENGTH = 200
export const BASIC_ITEM_INFO_ID = [1, 2, 3, 4, 5, 31, 32, 33, 34, 35]

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class ItemInfo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        length: MAX_ITEMINFO_NAME_LENGTH,
    })
    name: string

    @Column('varchar', {
        length: MAX_ITEMINFO_DESCRIPTION_LENGTH,
    })
    description: string

    @Column('tinyint')
    itemType: ItemType

    @OneToMany(type => Item, item => item.itemInfo)
    items: Item[]

    @ManyToMany(type => Player)
    @JoinTable()
    finders: Player[]

    @ManyToMany((type) => ItemCollection, (itemCollection) => itemCollection.itemInfos)
    itemCollections: ItemCollection[];
    
    @Column('char', {
        length: NANOID_LENGTH,
        unique: true
    })
    silhouetteId: string
}

@ChildEntity()
export abstract class EquipableItemInfo extends ItemInfo {

    @Column('tinyint')
    battleType: BattleType

    @Column('tinyint')
    specialized: Specialized

    @Column('int')
    durability: number//맨 처음 durability

}

@ChildEntity()
export class WeaponEquipableItemInfo extends EquipableItemInfo {

}

@ChildEntity()
export class AccessoryEquipableItemInfo extends EquipableItemInfo {
    
}

@ChildEntity()
export class EnchantItemInfo extends ItemInfo { 

    @Column('int', {
        default: 0.5
    })
    enchantSuccess: number

    @Column('boolean', {
        default: false
    })
    onStart: boolean

    @Column('boolean', {
        default: false
    })
    onTurn: boolean

    @Column('int', {
        default: 0
    })
    special: number

    @Column('boolean', {
        default: false
    })
    isChangeBattleType: boolean

    @Column('tinyint')
    battleType: BattleType

    @Column("simple-json")
    startStatus: {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }

    @Column("simple-json")
    effectStatusToSelf: {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }

    @Column("simple-json")
    effectStatusToEnemy: {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }

    @Column('int', {
        default: 1
    })
    attackCount: number

    @Column('int', {
        default: 1
    })
    attackTurn: number

    @Column('boolean', {
        default: true
    })
    isDroppable: boolean

}

@ChildEntity()
export abstract class CoordiItemInfo extends ItemInfo {

    @Column('simple-array')
    layers: Layer[]

}

@ChildEntity()
export class FaceCoordiItemInfo extends CoordiItemInfo {

}

@ChildEntity()
export class HairCoordiItemInfo extends CoordiItemInfo {

}

@ChildEntity()
export class SuitCoordiItemInfo extends CoordiItemInfo {

}

@ChildEntity()
export class DecoCoordiItemInfo extends CoordiItemInfo {

}
