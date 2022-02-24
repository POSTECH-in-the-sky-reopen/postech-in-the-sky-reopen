import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BattleType } from "../enums/BattleType"
import { NANOID_LENGTH } from "./User"

export const MAX_MONSTERINFO_NAME_LENGTH = 40
export const MONSTER_STATUS_EXP_BASE = 2

@Entity()
export class MonsterInfo extends BaseEntity { 

    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        length: MAX_MONSTERINFO_NAME_LENGTH,
    })
    name: string
    
    @Column('tinyint')
    battleType: BattleType

    @Column("simple-json")
    minStatus : {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }

    @Column("simple-json")
    maxStatus : {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }
    
    @Column('char', {
        length: NANOID_LENGTH,
        unique: true
    })
    silhouetteId: string

}

export interface BossMonsterInfoData {
    name: string
    battleType: BattleType
    status : {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }
    silhouetteId: string
}

@Entity()
export class BossMonsterInfo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {
        length: MAX_MONSTERINFO_NAME_LENGTH,
    })
    name: string
    
    @Column('tinyint')
    battleType: BattleType

    @Column("simple-json")
    status : {
        attack: number,
        defense: number,
        hpmax: number,
        luck: number
    }
    
    @Column('char', {
        length: NANOID_LENGTH,
        unique: true
    })
    silhouetteId: string

}