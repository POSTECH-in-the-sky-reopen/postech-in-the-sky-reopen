import { BattleType } from "src/enums/BattleType";
import { EffectType } from "src/enums/EffectType";
import { Status } from "./Status";

export interface Log {
    [x: string]: any;
    LogType: "Inital" | "Effect" | "Attack" | "Event"
    OnlyMessage: boolean
    EffectMessage: string
}

export interface NpcLog extends Log {
    name: string
}

export interface InitalLog extends Log {
    Turn: number
    PlayerStatus: Status
    PlayerWeaponType: BattleType
    PlayerAccessoryType: BattleType
    MonsterStatus: Status
    MonsterType: BattleType
}

export interface EffectLog extends Log {
    Turn: number
    IsEffectOnPlayer: boolean
    EffectType: EffectType
}

export interface AttackLog extends Log {
    Turn: number
    IsPlayerAttack: boolean
    AttackerStatus: Status
    DefenderStatus: Status
    Damage: number
    IsCritical: boolean
    IsDodge: boolean
    Success: boolean
}