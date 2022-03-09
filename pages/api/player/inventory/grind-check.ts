// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import { EquipableItemRepository, ItemRepository } from 'src/repository/ItemRepository'
import { EquipableItem, Item, ITEM_SHARPNESS_GRIND_COST, ITEM_SHARPNESS_GRIND_RATE, ITEM_SHARPNESS_INSANE_MAX } from 'src/entity/Item'
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import Joi from 'joi'
import { sharpnessDiff } from 'src/enums/ItemType'
import { getEquipableItemStatus } from 'pages/api/player/status/check'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { Status } from 'src/interfaces/Status'
import {deepCopy} from 'src/util/DeepCopy'

type Data = {
    item?: Item
    probability?: {[key in sharpnessDiff] : number}
    cost?: number
    improvedStatus?: Status
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
        }, { relations: ["player", "player.group"] })
        if (user === undefined) {
            throw new Error("해당하는 유저가 없습니다.")
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.")
        }
        const _item = await itemRepository.findOne(itemId, {
            relations: ["player", "enchantItemInfo"]
        })
        if(_item === undefined || _item.player === null || _item.player.id !== user.player.id){
            throw new Error("아이템이 존재하지 않습니다.")
        }

        const item = _item as EquipableItem
        if (item.sharpness < 0 || item.sharpness >= ITEM_SHARPNESS_INSANE_MAX) {
            throw new Error("강화 불가능한 상태입니다.")
        }

        const cost = Math.round(ITEM_SHARPNESS_GRIND_COST[item.sharpness] * (100 - user.player.group.equipableReinforceCost)/100 * (item.level > 0 ? item.level : 1))
        
        let probability: {[key in sharpnessDiff] : number} = deepCopy(ITEM_SHARPNESS_GRIND_RATE[item.sharpness])
        probability[sharpnessDiff.SUCCESS] += user.player.group.equipableReinforceSuccess
        if(probability[sharpnessDiff.SUCCESS] >= 100){
            probability[sharpnessDiff.SUCCESS] = 100
            probability[sharpnessDiff.FAIL] = 0
            probability[sharpnessDiff.SAME] = 0
        }
        else{
            probability[sharpnessDiff.FAIL] -= user.player.group.equipableReinforceSuccess
            if(probability[sharpnessDiff.FAIL]<0){
                probability[sharpnessDiff.SAME] += probability[sharpnessDiff.FAIL]
                probability[sharpnessDiff.FAIL] = 0
            }
        }

        const tempItem = item
        tempItem.sharpness += 1
        const improvedStatus = getEquipableItemStatus(tempItem as EquipableItem)

        return res.status(200).json({
            item: item,
            probability: probability,
            cost: cost,
            improvedStatus: improvedStatus
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