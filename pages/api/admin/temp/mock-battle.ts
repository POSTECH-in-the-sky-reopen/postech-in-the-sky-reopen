// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Joi from "joi"
import { battle } from 'src/util/Battle'
import { BattleType, fullBattleType } from 'src/enums/BattleType'
import { Status, statusToString, statusToStringVerbose } from 'src/interfaces/Status'
import { EnchantItemInfo } from 'src/entity/ItemInfo'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from 'typeorm'
import { EnchantItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { Log } from 'src/interfaces/Log'

type Data = {
    Logs?: Log[],
    message?: string
}

const schema = Joi.object({
    playerStatus: Joi.object({
        attack: Joi.number()
            .required(),
        defense: Joi.number()
            .required(),
        hpmax: Joi.number()
            .required(),
        luck: Joi.number()
            .required(),
    }).required(),
    weaponBattleType: Joi.number()
        .required(),
    accessoryBattleType: Joi.number()
        .required(),
    monsterStatus: Joi.object({
        attack: Joi.number()
            .required(),
        defense: Joi.number()
            .required(),
        hpmax: Joi.number()
            .required(),
        luck: Joi.number()
            .required(),
    }).required(),
    monsterBattleType: Joi.number()
        .required(),
    playerWeaponEnchantItemInfoId: Joi.number()
        .required(),
    monsterEnchantItemInfoId: Joi.number()
        .required(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message
        })
    }
    const { playerStatus, weaponBattleType, accessoryBattleType, monsterStatus, monsterBattleType,
        playerWeaponEnchantItemInfoId, monsterEnchantItemInfoId }: {
            playerStatus: Status,
            weaponBattleType: BattleType,
            accessoryBattleType: BattleType,
            monsterStatus: Status,
            monsterBattleType: BattleType,
            playerWeaponEnchantItemInfoId: number,
            monsterEnchantItemInfoId: number
        } = req.body

    let playerWeaponEnchantItemInfo: EnchantItemInfo | undefined
    let monsterEnchantItemInfo: EnchantItemInfo | undefined
    await prepareConnection()
    try {
        const enchantItemInfoRepository = getCustomRepository(EnchantItemInfoRepository)
        playerWeaponEnchantItemInfo = await enchantItemInfoRepository.findOne(playerWeaponEnchantItemInfoId)
    } catch (err) {
        playerWeaponEnchantItemInfo = undefined
    }
    try {
        const enchantItemInfoRepository = getCustomRepository(EnchantItemInfoRepository)
        monsterEnchantItemInfo = await enchantItemInfoRepository.findOne(monsterEnchantItemInfoId)
    } catch (err) {
        monsterEnchantItemInfo = undefined
    }
    let [isPlayerWin, logs] = battle(
        { status: playerStatus, attackBattleType: weaponBattleType, defenseBattleType: accessoryBattleType, enchantItemInfo: playerWeaponEnchantItemInfo },
        { status: monsterStatus, attackBattleType: monsterBattleType, defenseBattleType: monsterBattleType, enchantItemInfo: monsterEnchantItemInfo }
    )

    let turn = 0
    let criticalCount = 0
    let dodgeCount = 0
    console.log("============BATTLE START============\n")
    for (let log of logs) {
        let message = ""
        switch (log.LogType) {
            case "Inital":
                message += "--------------------------------\n\n"
                message += "???????????? ?????????\n\n"
                message += statusToStringVerbose(log.PlayerStatus) + "\n"
                message += "???????????? ?????? ??????: " + fullBattleType(log.PlayerWeaponType) + "\n\n"
                message += "???????????? ???????????? ??????: " + fullBattleType(log.PlayerAccessoryType) + "\n\n"
                message += "--------------------------------\n\n"
                message += "????????? ?????????\n\n"
                message += statusToStringVerbose(log.MonsterStatus) + "\n"
                message += "????????? ??????: " + fullBattleType(log.MonsterType) + "\n\n"
                message += "--------------------------------\n"
                break
            case "Attack":
                turn++
                let attacker = log.IsPlayerAttack ? "????????????" : "?????????";
                let defender = log.IsPlayerAttack ? "?????????" : "????????????";
                let attack = log.IsCritical ? "????????? ??????! " : "??????! ";
                criticalCount += log.IsCritical ? 1 : 0
                dodgeCount += log.IsDodge ? 1 : 0
                let noDodge = attacker + "??? " + attack + defender + "?????? " + log.Damage + "??? ?????????!"
                let Dodge = attacker + "??? ??????! " + "????????? " + defender + "??? ?????????!"
                message = log.Turn + "?????? ??? > " + (log.IsDodge ? Dodge : noDodge) + "\n" + log.EffectMessage + "\n"
                break
            case "Effect":
                let EffectOn = log.IsEffectOnPlayer ? "????????????" : "?????????";
                message += EffectOn + "??? " + log.EffectMessage + "\n"
                break
        }
        console.log(message)
    }
    console.log(isPlayerWin ? "??????\n" : "??????\n")
    console.log("BATTLE END")
    console.log(
        "Turn: " + (turn / 2)
        + ", critical count: " + criticalCount
        + ", dodge count: " + dodgeCount
    )

    return res.status(200).json({
        Logs: logs,
    })
}