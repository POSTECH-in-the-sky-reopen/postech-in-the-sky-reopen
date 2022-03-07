import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany, JoinTable } from 'typeorm'
import { Region } from './Region'
import { BattleType } from '../enums/BattleType'
import { Player } from './Player'
import { Siege } from './Siege'
import { GroupInfo } from './GroupInfo'

export const DEFAULT_CELL_LOCATION = 26
export const MAX_CELL_LEVEL = 100
export const AVG_CELL_PER_REGION = 17
export const CELL_LEVEL_RESTRICT_AMOUNT = 1
export enum CardinalDirection { East, West, South, North }

@Entity()
export class Cell extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        unique: true,
        length: 30
    })
    name: string
    
    @Column('tinyint')
    level: number

    @ManyToOne(type => Region, region => region.cells)
    region: Region

    @Column('tinyint')
    battleType: BattleType

    @OneToMany(type => Player, player => player.location)
    players: Player[]

    @Column('bool', {
        default: false
    })
    isCapturable: boolean

    @Column('bool',{
        default: true
    })
    ableToBattle: boolean

    @ManyToOne(type => GroupInfo, group => group.players, {
        eager: true
    })
    group: GroupInfo

    @OneToMany(type => Siege, sieges => sieges.cell, {
        nullable: true
    })
    sieges: Siege[]

    @Column('bool', {
        default: false
    })
    isTeleportable: boolean

    @Column('bool', {
        default: false
    })
    isEnding: boolean

    @OneToOne(type => Cell, adjCell => adjCell.adjWest, {
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn()
    adjEast: Cell

    @OneToOne(type => Cell, adjCell => adjCell.adjEast, {
        onDelete: "SET NULL",
        nullable: true
    })
    adjWest: Cell

    @OneToOne(type => Cell, adjCell => adjCell.adjNorth, {
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn()
    adjSouth: Cell

    @OneToOne(type => Cell, adjCell => adjCell.adjSouth, {
        onDelete: "SET NULL",
        nullable: true
    })
    adjNorth: Cell

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
