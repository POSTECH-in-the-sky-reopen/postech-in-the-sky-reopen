import { EnchantItemInfo } from "src/entity/ItemInfo";
import { BattleType, calcBattleTypeAdvantage, getStrongAdvantage, getWeakAdvantage } from "src/enums/BattleType";
import { AttackLog } from "src/interfaces/Log";
import { Status } from "src/interfaces/Status";
import { calcDamage } from "./Damage";
import { checkThreeSixNine, eratosthenesTurn, Special } from "./SpecialEnchant";

const MAX_LUCK = 500

function checkSuccess(successRate: number): boolean {
    return (1 < Math.random() + successRate)
}

function checkDodge(defenderluck: number): boolean {
    return (1 < Math.random() + (Math.min(defenderluck, MAX_LUCK) / (MAX_LUCK * 3)))
}

function checkCritical(attackerluck: number): boolean {
    const INITIAL_CRITICAL_RATE = 0.20
    return (1 < Math.random() + (Math.min(attackerluck, MAX_LUCK) / (MAX_LUCK * 1.5)) + INITIAL_CRITICAL_RATE)
}

function checkWeakAdvantageByLuck(attackerluck: number): boolean {
    const INITIAL_ADVANTAGE_RATE = 0.30
    return (1 < Math.random() + (Math.min(attackerluck, MAX_LUCK) / (MAX_LUCK * 1.5)) + INITIAL_ADVANTAGE_RATE)
}

function checkStrongAdvantageByLuck(attackerluck: number): boolean {
    const INITIAL_ADVANTAGE_RATE = 0.20
    return (1 < Math.random() + (Math.min(attackerluck, MAX_LUCK) / MAX_LUCK * 1.5) + INITIAL_ADVANTAGE_RATE)
}

export function getAttackLog(
    isPlayerAttack: boolean,
    attackerStatus: Status, attackType: BattleType,
    defenderStatus: Status, defenseType: BattleType,
    turn: number, enchantItemInfo: EnchantItemInfo | undefined, isMoreAttack: boolean
): AttackLog {
    let success = true
    let effectMessage = ""

    // before attack phase
    let isDodge = checkDodge(defenderStatus.luck)
    let isCritical = isDodge ? false : checkCritical(attackerStatus.luck)
    let advantage_rate = calcBattleTypeAdvantage(attackType, defenseType)
    if (enchantItemInfo !== undefined) {
        switch (enchantItemInfo.special) {
            case Special.LIBERO:
                if (checkWeakAdvantageByLuck(attackerStatus.luck)) {
                    advantage_rate = 1.2
                    effectMessage += enchantItemInfo.name + "의 효과로 공격 상성이 조금 유리해졌다!"
                }
                break
            case Special.PROTEAN:
                if (checkStrongAdvantageByLuck(attackerStatus.luck)) {
                    advantage_rate = 1.5
                    effectMessage += enchantItemInfo.name + "의 효과로 공격 상성이 매우 유리해졌다!!!"
                }
                break
            default:
                break
        }
    }

    // attack phase
    let damage = isDodge ? 0 : calcDamage(attackerStatus.attack, defenderStatus.defense, isCritical, advantage_rate)

    // after attack phase

    if (enchantItemInfo !== undefined) {
        switch (enchantItemInfo.special) {
            case Special.ERATOSTHENES:
                if (!isDodge && eratosthenesTurn.includes(turn)) {
                    let extraDamage = Math.round(attackerStatus.attack * 0.15)
                    damage += extraDamage
                    effectMessage += enchantItemInfo.name + "의 효과로 " + turn + "번째 턴에 " + extraDamage + "의 추가 피해가 적용됩니다."
                }
                break
            case Special.BASKIN_ROBBINS:
                if (turn == 31) {
                    damage = defenderStatus.hpmax
                    effectMessage += enchantItemInfo.name + "의 효과로 31번째 턴에 상대 체력 만큼 피해를 줍니다!"
                }
                break
            case Special.THREE_SIX_NINE:
                if (!isDodge && checkThreeSixNine(turn)) {
                    let extraDamage = Math.round(attackerStatus.attack * 0.369)
                    damage += extraDamage
                    effectMessage += enchantItemInfo.name + "의 효과로 " + turn + "번째 턴에 " + extraDamage + "의 추가 피해가 적용됩니다."
                }
                break
            case Special.NAIL:
                if (!isDodge && turn % 2 == 0) {
                    damage = Math.round(attackerStatus.attack * 0.9)
                    effectMessage += enchantItemInfo.name + "의 효과로 " + damage + "의 고정 피해가 적용됩니다."
                }
                break
            case Special.SUSPICIOUS:
                if (checkSuccess(0.6)) {
                    damage *= 2
                    effectMessage += enchantItemInfo.name + "의 효과로 2배의 피해가 적용됩니다."
                } else {
                    damage = 0
                    effectMessage += enchantItemInfo.name + "의 효과로 0배의 피해가 적용됩니다."
                }
            default:
                break
        }
    }

    defenderStatus.hpmax -= Math.round(damage)

    // return
    return {
        Turn: turn,
        LogType: "Attack",
        OnlyMessage: false,
        IsPlayerAttack: isPlayerAttack,
        AttackerStatus: attackerStatus,
        DefenderStatus: defenderStatus,
        Damage: damage,
        IsCritical: isCritical,
        IsDodge: isDodge,
        Success: success,
        EffectMessage: effectMessage
    } as AttackLog
}