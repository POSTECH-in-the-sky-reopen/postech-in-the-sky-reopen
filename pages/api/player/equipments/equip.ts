// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { ItemRepository } from 'src/repository/ItemRepository'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { EquipableItem, Item } from 'src/entity/Item'
import { readToken } from 'src/lib/jwt'
import { UserRepository } from 'src/repository/UserRepository'
import { CoordiItemInfo, EquipableItemInfo } from 'src/entity/ItemInfo'
import { ItemType } from 'src/enums/ItemType'

type Data = {
    current?: Item, // 결과 장착한 아이템
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
    const token = req.cookies['token']
    const { itemId }: { itemId: number } = req.body
    await prepareConnection()
    const itemRepository = getCustomRepository(ItemRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    const userRepository = getCustomRepository(UserRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) throw new Error()

        const player = await playerRepository.findOne(user.player.id)
        if (player === undefined) throw new Error()

        const item = await itemRepository.findOne({
            id: itemId, 
            player: { id: player.id }
        })
        if (item === undefined) {
            return res.status(404).json({
                "message": "아이템이 없습니다."
            })
        }
        if (item.equiped) {
            return res.status(409).json({
                "message": "이미 장비하고 있습니다."
            })
        }
        if (!(item.itemInfo instanceof EquipableItemInfo || item.itemInfo instanceof CoordiItemInfo)) {
            return res.status(400).json({
                "message": "장비할 수 있는 종류의 아이템이 아닙니다."
            })
        }
        if(item.itemInfo.itemType === ItemType.WEAPON || item.itemInfo.itemType === ItemType.ACCESSORY){
            if((item as EquipableItem).durability <= 0){
                return res.status(400).json({
                    "message": "아이템의 내구도가 0이어서 착용할 수 없습니다."
                })
            }
        }
        await itemRepository.update({
            player: player,
            equiped: true,
            itemType: item.itemInfo.itemType,
        }, { equiped: false })
        
        item.equiped = true
        const current = await item.save()
        return res.status(200).json({
            current: current
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "알 수 없는 이유로 실패하였습니다."
        })
    }
}