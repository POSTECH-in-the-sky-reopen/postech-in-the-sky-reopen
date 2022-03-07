import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./Player";

// 보스에게 데미지를 가장 많이 넣은 사람 <- 총 보스 데미지 저장
// 코디 가챠에 돈을 가장 많이 쓴 사람 <- 총 가챠 소비 재화 저장
// 가장 많이 죽은 사람 <- 패배 횟수 기록
// 한 번에 가장 많은 데미지를 준 사람 <- 데미지 로그 보고 최대 데미지 기록
// 가장 많은 턴을 소모한 전투(최장 전투)를 한 사람 <- 최대 턴 기록

@Entity()
export class Achievement extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(type=>Player, player=>player.achievement)
    player: Player

    @Column('int',{
        default: 0
    })
    wholeBossDamage: number // 완

    @Column('int',{
        default: 0
    })
    moneyUsed: number // 완

    @Column('int',{
        default: 0
    })
    cloudTowerFloor: number

    @Column('int',{
        default: 0
    })
    loseCount: number // 완

    @Column('int',{
        default: 0
    })
    maxDamage: number // 완

    @Column('int',{
        default: 0
    })
    maxTurn: number // 완

}