// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { readToken } from 'src/lib/jwt'
import { UserRepository } from 'src/repository/UserRepository'
import { getEquipments } from './equipments/get'
import { getRegion } from './location/current'
import { Equipments } from 'src/interfaces/Equipments'
import { EquipableItem } from 'src/entity/Item'

type Data = {
    winRate?: number
    message?: string
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']
    await prepareConnection()
    const playerRepository = getCustomRepository(PlayerRepository)
    const userRepository = getCustomRepository(UserRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) {
            throw new Error("no user");
        }
        if (user.player === null) {
            throw new Error("no player")
        }

        const equipments = await getEquipments(user.player.id)
        const regionLevel = (await getRegion(studentId)).level

        const winRate = getWinRate(equipments, regionLevel)

        return res.status(200).json({
            winRate: winRate
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(404).json({
                message: err.message
            })
        }
        return res.status(500).json({
            message: "알 수 없는 이유로 실패하였습니다."
        })
    }
}

export function getWinRate(equipments: Equipments, regionLevel:number) {
    if (equipments.Weapon == undefined || equipments.Accessory == undefined) {
        return 0
    }
    let playerLevel = ((equipments.Weapon as EquipableItem).level + (equipments.Accessory as EquipableItem).level) / 2
    let winRate = Math.max(Math.min(50 + (playerLevel - regionLevel) * 10, 99), 1)
    return winRate
}

