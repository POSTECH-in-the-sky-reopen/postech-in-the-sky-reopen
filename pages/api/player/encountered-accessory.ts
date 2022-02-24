// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { BattleType } from 'src/enums/BattleType'
import { EquipableItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { ItemType } from 'src/enums/ItemType'

interface SimpleEquipableItemInfo {
    encountered: boolean,
    name?: string,
    description?: string,
    battleType: BattleType,
    silhouetteId: string,
}

type Data = {
    items?: SimpleEquipableItemInfo[],
    message?: string
}

// no req

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const equipableItemInfoRepository = getCustomRepository(EquipableItemInfoRepository)
    const token = req.cookies['token']
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({ studentId: studentId }, { relations: ["player", "player.foundItemInfo"] })

        if (user === undefined) {
            return res.status(404).json({
                message: "해당 학번에 해당하는 유저가 없습니다."
            })
        }

        let items = await equipableItemInfoRepository.find({
            where: {
                itemType: ItemType.ACCESSORY
            },
            order: {
                battleType: "ASC"
            }
        })
        let foundItemInfo = user.player.foundItemInfo.map(itemInfo => itemInfo.id)
        let retItems: SimpleEquipableItemInfo[] = []
        for (let itemInfo of items) {
            let simpleAccessoryInfo: SimpleEquipableItemInfo = {
                encountered: foundItemInfo.includes(itemInfo.id),
                silhouetteId: itemInfo.silhouetteId,
                battleType: itemInfo.battleType,
            }
            if (simpleAccessoryInfo.encountered) {
                simpleAccessoryInfo.name = itemInfo.name
                simpleAccessoryInfo.description = itemInfo.description
            }
            retItems.push(simpleAccessoryInfo)
        }

        return res.status(200).json({
            items: retItems
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            console.error(err)
            return res.status(500).json({
                message: '알 수 없는 오류가 발생했습니다.'
            })
        }
    }

}