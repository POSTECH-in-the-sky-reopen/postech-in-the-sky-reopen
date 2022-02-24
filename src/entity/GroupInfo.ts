import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, RelationId, UpdateDateColumn, ManyToMany } from 'typeorm'
import { Cell } from './Cell'
import { ItemCollection } from './ItemCollection'
import { Player } from './Player'

@Entity()
export class GroupInfo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('int')
    num: number

    @OneToMany(type => Cell, cell => cell.group)
    occupiedCells: Cell[]

    @OneToMany(type => Player, player => player.group)
    players: Player[]

    @ManyToMany(type => ItemCollection, itemCollection => itemCollection.groups)
    itemCollections: ItemCollection[]

    @Column("simple-array")
    collectionMarks: number[]

    @Column("int", {
        default: 0,
    })
    enchantSuccess: number

    @Column("int", {
        default: 0,
    })
    equipableDrop: number

    @Column("int", {
        default: 0,
    })
    enchantDrop: number

    @Column("int", {
        default: 0,
    })
    fatigueIncrease: number

    @Column("int", {
        default: 0,
    })
    equipableReinforceSuccess: number

    @Column("int", {
        default: 0,
    })
    equipableReinforceCost: number

    @Column("int", {
        default: 0,
    })
    moneyEarn: number

    @Column("int", {
        default: 0,
    })
    coordiCost: number
}
