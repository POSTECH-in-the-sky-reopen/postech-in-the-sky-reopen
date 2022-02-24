import { EnchantItemInfo } from "src/entity/ItemInfo";
import { BattleType, fullBattleType } from "src/enums/BattleType";
import { EffectType } from "src/enums/EffectType";
import { EquipedInformation } from "src/interfaces/EquipedInformation";
import { EffectLog, InitalLog, Log } from "src/interfaces/Log";
import { isZero, makeStatus, mulStatus, Status, statusToString, sumStatus } from "src/interfaces/Status";
import { getAttackLog } from "./Attack";
import { deepCopy } from "./DeepCopy";
import { Special } from "./SpecialEnchant";

export function makeStatusEffectLog(effectType: EffectType, isEffectOnPlayer: boolean, turn: number, name: string, status: Status): EffectLog {
    return {
        Turn: turn,
        LogType: "Effect",
        OnlyMessage: false,
        EffectMessage: name + "의 효과로 " + statusToString(status) + "배의 추가 능력치를 얻습니다.",
        EffectType: effectType,
        IsEffectOnPlayer: isEffectOnPlayer,
    } as EffectLog
}

export function makeBattleTypeEffectLog(effectType: EffectType, isEffectOnPlayer: boolean, turn: number, enchantItemInfo: EnchantItemInfo): EffectLog {
    return {
        Turn: turn,
        LogType: "Effect",
        OnlyMessage: false,
        EffectMessage: enchantItemInfo.name + "의 효과로 무기의 속성이 " + fullBattleType(enchantItemInfo.battleType) + "(으)로 변경됩니다.",
        EffectType: effectType,
        IsEffectOnPlayer: isEffectOnPlayer,
    } as EffectLog
}

export function makeAttackEffectLog(effectType: EffectType, isEffectOnPlayer: boolean, turn: number, enchantItemInfo: EnchantItemInfo): EffectLog | undefined {
    let countMessage = enchantItemInfo.attackCount !== 1 ? enchantItemInfo.name + "의 효과로 공격 횟수가 " + enchantItemInfo.attackCount + "(으)로 변경됩니다. " : ""
    let turnMessage = enchantItemInfo.attackTurn !== 1 ? enchantItemInfo.name + "의 효과로 " + enchantItemInfo.attackTurn + "턴마다 공격합니다. " : ""
    if (countMessage == "" && turnMessage == "") {
        return undefined
    }
    return {
        Turn: turn,
        LogType: "Effect",
        OnlyMessage: false,
        EffectMessage: countMessage + turnMessage,
        EffectType: effectType,
        IsEffectOnPlayer: isEffectOnPlayer,
    } as EffectLog
}

export function battle(
    player: EquipedInformation,
    monster: EquipedInformation
): [boolean, Log[],number] {
    const TURNSTART = 1
    let battleLog: Log[] = []
    let turn = TURNSTART
    let TURN_FLAG: "PLAYER" | "MONSTER" = "MONSTER"
    let isPlayerWin: boolean = false
    let statusChangePtoP = false
    let statusChangePtoM = false
    let statusChangeMtoP = false
    let statusChangeMtoM = false
    let playerAttackCount = 1
    let playerAttackTurn = 1
    let monsterAttackCount = 1
    let monsterAttackTurn = 1

    const initalPlayerStatus = player.status
    const initalMonsterStatus = monster.status

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

    //console.log(player.enchantItemInfo)
    //console.log(monster.enchantItemInfo)

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


    if (monster.enchantItemInfo !== undefined) {
        if (monster.enchantItemInfo.isChangeBattleType) {
            monster.attackBattleType = monster.enchantItemInfo.battleType
            battleLog.push(deepCopy(makeBattleTypeEffectLog(EffectType.START, false, turn, monster.enchantItemInfo)))
        }

        if (monster.enchantItemInfo.onStart) {
            if (!isZero(monster.enchantItemInfo.startStatus)) {
                monster.status = sumStatus(initalMonsterStatus, mulStatus(initalMonsterStatus, monster.enchantItemInfo.startStatus))
                battleLog.push(deepCopy(makeStatusEffectLog(EffectType.START, false, turn, monster.enchantItemInfo.name, monster.enchantItemInfo.startStatus)))
            }
        }

        if (monster.enchantItemInfo.onStart || monster.enchantItemInfo.onTurn) {
            monsterAttackCount = monster.enchantItemInfo.attackCount
            monsterAttackTurn = monster.enchantItemInfo.attackTurn
            if (monster.enchantItemInfo.attackCount !== 1 || monster.enchantItemInfo.attackTurn !== 1) {
                battleLog.push(deepCopy(makeAttackEffectLog(EffectType.START, false, turn, monster.enchantItemInfo)))
            }
        }
    }

    if (player.enchantItemInfo !== undefined) {
        if (player.enchantItemInfo.isChangeBattleType) {
            player.attackBattleType = player.enchantItemInfo.battleType
            battleLog.push(deepCopy(makeBattleTypeEffectLog(EffectType.START, true, turn, player.enchantItemInfo)))
        }

        if (player.enchantItemInfo.onStart) {
            if (!isZero(player.enchantItemInfo.startStatus)) {
                player.status = sumStatus(initalPlayerStatus, mulStatus(initalPlayerStatus, player.enchantItemInfo.startStatus))
                battleLog.push(deepCopy(makeStatusEffectLog(EffectType.START, true, turn, player.enchantItemInfo.name, player.enchantItemInfo.startStatus)))
            }
        }

        if (player.enchantItemInfo.onStart || player.enchantItemInfo.onTurn) {
            playerAttackCount = player.enchantItemInfo.attackCount
            playerAttackTurn = player.enchantItemInfo.attackTurn
            if (player.enchantItemInfo.attackCount !== 1 || player.enchantItemInfo.attackTurn !== 1) {
                battleLog.push(deepCopy(makeAttackEffectLog(EffectType.START, true, turn, player.enchantItemInfo)))
            }
        }
    }

    // battle
    while (turn < 1000) {
        // turn start

        // before monster turn
        TURN_FLAG = "MONSTER"

        // monster turn
        if (turn % monsterAttackTurn == 0) {
            for (let i = 0; i < monsterAttackCount; i++) {
                let monsterAttackLog = getAttackLog(false, monster.status, monster.attackBattleType,
                    player.status, player.defenseBattleType,
                    turn, monster.enchantItemInfo, i > 0)
                battleLog.push(deepCopy(monsterAttackLog))
                monster.status = monsterAttackLog.AttackerStatus
                player.status = monsterAttackLog.DefenderStatus
            }
        }

        // after monster turn
        if (player.status.hpmax <= 0) {
            isPlayerWin = false
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

                player.status = playerAttackLog.AttackerStatus
                monster.status = playerAttackLog.DefenderStatus
            }
        }

        // after player turn
        if (monster.status.hpmax <= 0) {
            isPlayerWin = true
            break
        }

        // turn end

        // monster enchant
        if (monster.enchantItemInfo !== undefined) {
            if (turn == TURNSTART && monster.enchantItemInfo.onStart && !monster.enchantItemInfo.onTurn) {
                monsterAttackCount = 1
                monsterAttackTurn = 1
            }
            if (monster.enchantItemInfo.onTurn) {
                if (turn == TURNSTART) {
                    statusChangeMtoP = !isZero(monster.enchantItemInfo.effectStatusToEnemy)
                    statusChangeMtoM = !isZero(monster.enchantItemInfo.effectStatusToSelf)
                }
                if (statusChangeMtoM) {
                    monster.status = sumStatus(monster.status, mulStatus(initalMonsterStatus, monster.enchantItemInfo.effectStatusToSelf))
                    battleLog.push(deepCopy(makeStatusEffectLog(EffectType.TURN, false, turn, monster.enchantItemInfo.name, monster.enchantItemInfo.effectStatusToSelf)))
                }
                if (statusChangeMtoP) {
                    player.status = sumStatus(player.status, mulStatus(initalPlayerStatus, monster.enchantItemInfo.effectStatusToEnemy))
                    battleLog.push(deepCopy(makeStatusEffectLog(EffectType.TURN, true, turn, monster.enchantItemInfo.name, monster.enchantItemInfo.effectStatusToEnemy)))
                }
            }
            if (monster.enchantItemInfo.special == Special.GETTING_KING) {
                if (turn % 3 == 0) {
                    monsterAttackCount = monster.enchantItemInfo.attackCount
                } else {
                    monsterAttackCount = 1
                }
            }
        }

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
                    player.status = sumStatus(player.status, mulStatus(initalPlayerStatus, player.enchantItemInfo.effectStatusToSelf))
                    battleLog.push(deepCopy(makeStatusEffectLog(EffectType.TURN, true, turn, player.enchantItemInfo.name, player.enchantItemInfo.effectStatusToSelf)))
                }
                if (statusChangePtoM) {
                    monster.status = sumStatus(monster.status, mulStatus(initalMonsterStatus, player.enchantItemInfo.effectStatusToEnemy))
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

    return [isPlayerWin, battleLog, turn]
}