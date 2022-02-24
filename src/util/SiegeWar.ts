
import { EffectType } from "src/enums/EffectType";
import { EquipedInformation } from "src/interfaces/EquipedInformation";
import { InitalLog, Log } from "src/interfaces/Log";
import { isZero, sumStatus } from "src/interfaces/Status";
import { getAttackLog } from "./Attack";
import { makeBattleTypeEffectLog, makeStatusEffectLog } from "./Battle";
import { deepCopy } from "./DeepCopy";
import { Special } from "./SpecialEnchant";

export function siegeWar(
    player: EquipedInformation,
    monster: EquipedInformation
): [Log[], number, number] {
    const TURNSTART = 1
    let battleLog: Log[] = []
    let turn = TURNSTART
    let wholeDamage = 0
    let TURN_FLAG: "PLAYER" | "MONSTER" = "MONSTER"
    let isPlayerWin: boolean = false
    let statusChangePtoP = false
    let statusChangePtoM = false
    let playerAttackCount = 1
    let playerAttackTurn = 1
    let monsterAttackCount = 1
    let monsterAttackTurn = 1

    // 무기/장신구 장착 검사
    if (player.attackBattleType === undefined || player.defenseBattleType === undefined) {
        throw new Error("무기와 장신구를 장착해야 전투할 수 있습니다.")
    }
    // 몬스터 속성 검사
    if (monster.attackBattleType === undefined || monster.defenseBattleType === undefined
        || monster.attackBattleType !== monster.defenseBattleType) {
        throw new Error("몬스터의 속성 정보가 잘못되었습니다.")
    }

    // before battle

    battleLog.push(deepCopy({
        LogType: "Inital",
        OnlyMessage: false,
        EffectMessage: "",
        Turn: 0,
        PlayerStatus: player.status,
        PlayerWeaponType: player.attackBattleType,
        PlayerAccessoryType: player.defenseBattleType,
        MonsterStatus: monster.status,
        MonsterType: monster.attackBattleType
    } as InitalLog))


    if (player.enchantItemInfo !== undefined) {
        if (player.enchantItemInfo.isChangeBattleType) {
            player.attackBattleType = player.enchantItemInfo.battleType
            battleLog.push(deepCopy(makeBattleTypeEffectLog(EffectType.START, true, turn, player.enchantItemInfo)))
        }

        if (player.enchantItemInfo.onStart) {
            if (!isZero(player.enchantItemInfo.startStatus)) {
                player.status = sumStatus(player.status, player.enchantItemInfo.startStatus)
                battleLog.push(deepCopy(makeStatusEffectLog(EffectType.START, true, turn, player.enchantItemInfo.name, player.enchantItemInfo.startStatus)))
            }
        }

        if (player.enchantItemInfo.onStart || player.enchantItemInfo.onTurn) {
            playerAttackCount = player.enchantItemInfo.attackCount
            playerAttackTurn = player.enchantItemInfo.attackTurn
        }
    }

    // battle
    while (turn < 100) {
        // turn start

        // before monster turn
        TURN_FLAG = "MONSTER"

        // monster turn
        if (turn % monsterAttackTurn == 0) {
            for (let i = 0; i < monsterAttackCount; i++) {
                let monsterAttackLog = getAttackLog(false, monster.status, monster.attackBattleType,
                    player.status, player.defenseBattleType,
                    turn, undefined, i > 0)
                battleLog.push(deepCopy(monsterAttackLog))
                monster.status = monsterAttackLog.AttackerStatus
                player.status = monsterAttackLog.DefenderStatus
            }
        }

        // after monster turn
        if (player.status.hpmax <= 0) {
            break
        }
        // before player turn
        TURN_FLAG = "PLAYER"

        // player turn
        if (turn % playerAttackTurn == 0) {
            for (let i = 0; i < playerAttackCount; i++) {
                let playerAttackLog = getAttackLog(true, player.status, player.attackBattleType,
                    monster.status, monster.attackBattleType,
                    turn, player.enchantItemInfo, i > 0)
                battleLog.push(deepCopy(playerAttackLog))
                wholeDamage += playerAttackLog.Damage
                player.status = playerAttackLog.AttackerStatus
                monster.status = playerAttackLog.DefenderStatus
            }
        }

        // after player turn
        // if (monster.status.hpmax <= 0) {
        //     isPlayerWin = true
        //     break
        // }

        // turn end

        // player enchant
        if (player.enchantItemInfo !== undefined) {
            if (turn == TURNSTART && player.enchantItemInfo.onStart && !player.enchantItemInfo.onTurn) {
                playerAttackCount = 1
                playerAttackTurn = 1
            }
            if (player.enchantItemInfo.onTurn) {
                if (turn == TURNSTART) {
                    statusChangePtoP = !isZero(player.enchantItemInfo.effectStatusToSelf)
                    statusChangePtoM = !isZero(player.enchantItemInfo.effectStatusToEnemy)
                }
                if (statusChangePtoP) {
                    player.status = sumStatus(player.status, player.enchantItemInfo.effectStatusToSelf)
                    battleLog.push(deepCopy(makeStatusEffectLog(EffectType.TURN, true, turn, player.enchantItemInfo.name, player.enchantItemInfo.effectStatusToSelf)))
                }
                if (statusChangePtoM) {
                    monster.status = sumStatus(monster.status, player.enchantItemInfo.effectStatusToEnemy)
                    battleLog.push(deepCopy(makeStatusEffectLog(EffectType.TURN, false, turn, player.enchantItemInfo.name, player.enchantItemInfo.effectStatusToEnemy)))
                }
            }
            if (player.enchantItemInfo.special == Special.GETTING_KING) {
                if (turn % 3 == 0) {
                    playerAttackCount = player.enchantItemInfo.attackCount
                } else {
                    playerAttackCount = 1
                }
            }
        }

        turn++
    }
    // after battle

    return [battleLog, turn, wholeDamage]
}