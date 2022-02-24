let CRITICAL_DAMAGE = 1.5 as const
let ABS_DEFENSE = 1 as const
let MIN_ATTACK_RATE = 0.95 as const
let ATTACK_RATE_INTERVAL = 0.1 as const
let DEFENSE_EFFICIENCY = 1.06 as const
let DEFENSE_SCALE = 0.005 as const

export function calcDamage(
    attack: number,
    defense: number,
    isCritical: boolean,
    advantage_rate: number,
): number {
    return Math.max(
        Math.round((Math.max(attack, 1) * (MIN_ATTACK_RATE + Math.random() * ATTACK_RATE_INTERVAL) // 공격 계수
            * (Math.pow(DEFENSE_EFFICIENCY, -DEFENSE_SCALE * (defense + ABS_DEFENSE)))) // 방어율 적용
            * advantage_rate // 상성 적용
            * (isCritical ? CRITICAL_DAMAGE : 1)), 1) // 크리티컬 적용
}
