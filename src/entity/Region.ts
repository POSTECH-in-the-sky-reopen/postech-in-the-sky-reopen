import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm'
import { Cell } from './Cell'

export const SUPPLY_APPEARANCE_RATE_PER_LEVEL = [ 10, 10, 10, 10, 10, 10]
export const MONSTER_STRENGTH_MULTIPLIER_PER_LEVEL = [0, 1.0, 2.0, 3.0, 4.0, 5.0]
export const MONSTER_ENCHANT_PROBABILITY_PER_LEVEL = [0, 0, 20, 40, 60, 100]
export const ITEM_DROP_EQUIPABLE_PROBABILITY_PER_LEVEL = [0, 50, 45, 40, 35, 25]
export const ITEM_DROP_ENCHANT_PROBABILITY_PER_LEVEL = [0, 50, 55, 60, 65, 70]
export const ITEM_DROP_LEVEL_PER_LEVEL = [
    [100,  0,  0,  0,  0,  0],
    [  0, 90, 10,  0,  0,  0],
    [  0, 80, 20,  0,  0,  0],
    [  0, 25, 60, 15,  0,  0],
    [  0,  0, 45, 50,  5,  0],
    [  0,  0,  0, 68, 30,  2],
]
export const MONEY_DROP_PER_LEVEL = [ 0, 25, 50, 75, 100, 125]

@Entity()
export class Region extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        unique: true,
        length: 30
    })
    name: string

    @Column('tinyint')
    level: number

    @OneToMany(type => Cell, cell => cell.region)
    @JoinColumn()
    cells: Cell[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
