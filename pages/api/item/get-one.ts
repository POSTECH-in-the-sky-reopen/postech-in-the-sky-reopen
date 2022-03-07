// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import { ItemRepository } from 'src/repository/ItemRepository'
import { EquipableItem, Item } from 'src/entity/Item'
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { Status } from 'src/interfaces/Status'
import Joi from 'joi'
import { ItemType } from 'src/enums/ItemType'
import { getEquipableItemStatus } from 'pages/api/player/status/check'
import { EnchantItemInfo } from 'src/entity/ItemInfo'

type Data = {
    item?: Item
    level?: number
    status?: Status
    statusBasic?: Status
    statusImproved?: Status
    enchant?: EnchantItemInfo
    message?: string
}

const schema = Joi.object({
    itemId: Joi.number()
        .required()
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message
        })
    }
    const { itemId } : { itemId: number } = req.body

    await prepareConnection()
    const itemRepository = getCustomRepository(ItemRepository)
    const userRepository = getCustomRepository(UserRepository)
    const token = req.cookies['token']
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) {
            throw new Error("해당하는 유저가 없습니다.")
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.")
        }
        const item = await itemRepository.findOne(itemId, {
            relations: ["player", "enchantItemInfo"]
        })
        if(item === undefined || item.player === null || item.player.id !== user.player.id){
            throw new Error("아이템이 존재하지 않습니다.")
        }
        let itemDetail: Data = { item: item }
        if(item.itemType == ItemType.ACCESSORY || item.itemType == ItemType.WEAPON){
            itemDetail.level = (item as EquipableItem).level
            itemDetail.status = getEquipableItemStatus(item as EquipableItem)
        }
        return res.status(200).json(itemDetail)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(404).json({
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