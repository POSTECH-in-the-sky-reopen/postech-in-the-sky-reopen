import { MONSTER_STATUS_EXP_BASE } from "src/entity/MonsterInfo"
import { deepCopy } from "src/util/DeepCopy"
import { ITEM_STATUS_EXP_BASE_MINUS, ITEM_STATUS_EXP_BASE_PLUS } from "src/entity/Item"

export interface Status {
    attack: number
    defense: number
    hpmax: number
    luck: number
}

export interface StatusOperation {
    (arg1: Status, arg2: Status): Status;
}

export const sumStatus: StatusOperation = (arg1: Status, arg2: Status): Status => {
    return deepCopy({
        attack: arg1.attack + arg2.attack,
        defense: arg1.defense + arg2.defense,
        hpmax: arg1.hpmax + arg2.hpmax,
        luck: arg1.luck + arg2.luck
    })
}

export const mulStatus: StatusOperation = (arg1: Status, arg2: Status): Status => {
    return deepCopy({
        attack: Math.floor(arg1.attack * arg2.attack),
        defense: Math.floor(arg1.defense * arg2.defense),
        hpmax: Math.floor(arg1.hpmax * arg2.hpmax),
        luck: Math.floor(arg1.luck * arg2.luck)
    })
}

export const minusStatus: StatusOperation = (arg1: Status, arg2: Status): Status => {
    return deepCopy({
        attack: arg1.attack - arg2.attack,
        defense: arg1.defense - arg2.defense,
        hpmax: arg1.hpmax - arg2.hpmax,
        luck: arg1.luck - arg2.luck
    })
}

export function makeStatus(attack: number, defense: number, hpmax: number, luck: number): Status {
    return {
        attack: attack,
        defense: defense,
        hpmax: hpmax,
        luck: luck
    } as Status
}

export function calculateBaseStatus(minStatus: Status, maxStatus: Status, ration: number) {
    return {
        attack: Math.floor(minStatus.attack + (maxStatus.attack - minStatus.attack) * ration),
        defense: Math.floor(minStatus.defense + (maxStatus.defense - minStatus.defense) * ration),
        hpmax: Math.floor(minStatus.hpmax + (maxStatus.hpmax - minStatus.hpmax) * ration),
        luck: Math.floor(minStatus.luck + (maxStatus.luck - minStatus.luck) * ration),
    } as Status
}

export function improveStatusItem(mul: number, status: Status): Status {
    const mul_plus = Math.pow(ITEM_STATUS_EXP_BASE_PLUS, mul - 1)
    const mul_minus = Math.pow(ITEM_STATUS_EXP_BASE_MINUS, mul - 1)
    return {
        attack: status.attack >= 0 ? Math.floor(status.attack * mul_plus) : Math.floor(status.attack * mul_minus),
        defense: status.defense >= 0 ? Math.floor(status.defense * mul_plus): Math.floor(status.defense * mul_minus),
        hpmax: status.hpmax >= 0 ? Math.floor(status.hpmax * mul_plus) : Math.floor(status.hpmax * mul_minus),
        luck: status.luck >= 0 ? Math.floor(status.luck * mul_plus) : Math.floor(status.luck * mul_minus),
    } as Status
}

export function improveStatusMonster(_mul: number, status: Status): Status {
    const mul = Math.pow(MONSTER_STATUS_EXP_BASE, _mul - 1)
    return {
        attack: Math.floor(status.attack * mul),
        defense: Math.floor(status.defense * mul),
        hpmax: Math.floor(status.hpmax * mul),
        luck: Math.floor(status.luck * mul),
    } as Status
}

export function isZero(status: Status): boolean {
    return (status.attack == 0) && (status.defense == 0) && (status.hpmax == 0) && (status.luck == 0)
}

export function statusToString(status: Status): string {
    let text = ""
    if (status.attack != 0) {
        text += "공격력: " + status.attack
    }
    if (status.defense != 0) {
        if (text != "") {
            text += "과 "
        }
        text += "방어력: " + status.defense
    }
    if (status.hpmax != 0) {
        if (text != "") {
            text += "과 "
        }
        text += "최대체력: " + status.hpmax
    }
    if (status.luck != 0) {
        if (text != "") {
            text += "과 "
        }
        text += "행운: " + status.luck
    }
    return text
}

export function statusToStringVerbose(status: Status): string {
    let text = ""
    text += "공격력: " + status.attack + "\n"
    text += "방어력: " + status.defense + "\n"
    text += "최대체력: " + status.hpmax + "\n"
    text += "행운: " + status.luck + "\n"
    return text
}