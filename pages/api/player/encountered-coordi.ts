// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { BattleType } from 'src/enums/BattleType'
import { CoordiItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { ItemType, Layer } from 'src/enums/ItemType'

interface SimpleCoordiItemInfo {
    encountered: boolean,
    coordiType: ItemType,
    name?: string,
    silhouetteId: string,
    layers?: Layer[]
}

type Data = {
    items?: SimpleCoordiItemInfo[],
    message?: string
}

// no req

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const coordiItemInfoRepository = getCustomRepository(CoordiItemInfoRepository)
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

        let items = await coordiItemInfoRepository.find()
        let foundItemInfo = user.player.foundItemInfo.map(item => item.id)
        let retItems: SimpleCoordiItemInfo[] = []
        for (let itemInfo of items) {
            let simpleCoordiInfo: SimpleCoordiItemInfo = {
                encountered: foundItemInfo.includes(itemInfo.id),
                silhouetteId: itemInfo.silhouetteId,
                coordiType: itemInfo.itemType,
                layers: itemInfo.layers,
            }
            if (simpleCoordiInfo.encountered) {
                simpleCoordiInfo.name = itemInfo.name
            }
            retItems.push(simpleCoordiInfo)
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