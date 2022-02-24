import { Item } from './Item'
import { Cell } from './Cell'
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, RelationId, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm'
import { Siege } from './Siege'
import { Achievement } from './Achievement'
import { Honored } from './Honored'
import { ItemInfo } from './ItemInfo'
import { GroupInfo } from './GroupInfo'
import { BossMonsterInfo, MonsterInfo } from './MonsterInfo'

export const MAX_NUM_EQUIPABLE_INVENTORY_EACH = 100
export const FATIGUE_LIMIT = 80
export const FATIGUE_INCREASE_AMOUNT = { lose: 20, win: 5 }
export const FATIGUE_REFRESH_MONEY = 100

@Entity()
export class Player extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        length: 20
    })
    name: string

    @OneToOne(type=>Honored, honored => honored.player)
    @JoinColumn()
    honored: Honored 

    @ManyToOne(type => Cell, cell => cell.players)
    @JoinColumn()
    location: Cell

    @OneToMany(type => Siege, sieges => sieges.player, {
        cascade: true,
    })
    sieges: Siege[]

    @OneToOne(type=>Achievement, achievement => achievement.player)
    @JoinColumn()
    achievement: Achievement

    @ManyToMany(type => ItemInfo)
    @JoinTable()
    foundItemInfo: ItemInfo[]

    @ManyToOne(type => GroupInfo, group => group.players)
    @JoinColumn()
    group: GroupInfo

    @Column('int', {
        default: 1
    })
    level: number

    @Column('int', {
        default: 0
    })
    money: number

    @OneToMany(type => Item, item => item.player, {
        cascade: true,
    })
    inventory: Item[]

    @Column('int', {
        default: 0
    })
    fatigue: number

    @ManyToMany(() => MonsterInfo, {
        cascade: ['insert', 'update'],
    })
    @JoinTable()
    encounteredMonsters: MonsterInfo[]

    @ManyToMany(() => BossMonsterInfo, {
        cascade: ['insert', 'update'],
    })
    @JoinTable()
    encounteredBossMonsters: BossMonsterInfo[]

    @Column('datetime', {
        default: () => 'CURRENT_TIMESTAMP'
    })
    fatigueLastUpdatedAt: Date
    
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
