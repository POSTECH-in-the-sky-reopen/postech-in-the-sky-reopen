export enum BattleType { SOCI, SENS, CALC, LOGC, MEMR, NONE }

const STRONG_ADVANTAGE = 1.5
const WEAK_ADVANTAGE = 1.2
const NORMAL = 1.0

export function fullBattleType(battleType: BattleType): string {
    switch (battleType) {
        case BattleType.SOCI:
            return "친화"
        case BattleType.SENS:
            return "감성"
        case BattleType.CALC:
            return "계산"
        case BattleType.LOGC:
            return "논리"
        case BattleType.MEMR:
            return "암기"
        default:
            return "구름"
    }
}

export function getWeakAdvantage(defenderType: BattleType): BattleType {
    switch (defenderType) {
        case BattleType.SOCI:
            return BattleType.MEMR
        case BattleType.SENS:
            return BattleType.SOCI
        case BattleType.CALC:
            return BattleType.SENS
        case BattleType.LOGC:
            return BattleType.CALC
        case BattleType.MEMR:
            return BattleType.LOGC
        default:
            return BattleType.NONE
    }
}

export function getStrongAdvantage(defenderType: BattleType): BattleType {
    switch (defenderType) {
        case BattleType.SOCI:
            return BattleType.LOGC
        case BattleType.SENS:
            return BattleType.MEMR
        case BattleType.CALC:
            return BattleType.SOCI
        case BattleType.LOGC:
            return BattleType.SENS
        case BattleType.MEMR:
            return BattleType.CALC
        default:
            return BattleType.NONE   
    }
}

export function calcBattleTypeAdvantage(attacker: BattleType, defender: BattleType): number {
    if (attacker == defender) {
        return NORMAL
    }
    else {
        switch (attacker) {
            case BattleType.SOCI:
                switch (defender) {
                    case BattleType.CALC:
                        return STRONG_ADVANTAGE
                    case BattleType.SENS:
                        return WEAK_ADVANTAGE
                }
                break
            case BattleType.SENS:
                switch (defender) {
                    case BattleType.LOGC:
                        return STRONG_ADVANTAGE
                    case BattleType.CALC:
                        return WEAK_ADVANTAGE
                }
                break
            case BattleType.CALC:
                switch (defender) {
                    case BattleType.MEMR:
                        return STRONG_ADVANTAGE
                    case BattleType.LOGC:
                        return WEAK_ADVANTAGE
                }
                break
            case BattleType.LOGC:
                switch (defender) {
                    case BattleType.SOCI:
                        return STRONG_ADVANTAGE
                    case BattleType.MEMR:
                        return WEAK_ADVANTAGE
                }
                break
            case BattleType.MEMR:
                switch (defender) {
                    case BattleType.SENS:
                        return STRONG_ADVANTAGE
                    case BattleType.SOCI:
                        return WEAK_ADVANTAGE
                }
                break
            default:
                return NORMAL
        }
        return 1 / calcBattleTypeAdvantage(defender, attacker)
    }
}