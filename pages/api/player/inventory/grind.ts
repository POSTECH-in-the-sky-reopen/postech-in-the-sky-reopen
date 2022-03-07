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
import { gachaMultipleDict } from 'src/lib/random'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import {deepCopy} from 'src/util/DeepCopy'

type Data = {
    item?: Item
    sharpnessDiff?: sharpnessDiff
    cost?: number
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
    const equipableItemRepository = getCustomRepository(EquipableItemRepository)
    const userRepository = getCustomRepository(UserRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
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

        const cost = Math.round(ITEM_SHARPNESS_GRIND_COST[item.sharpness] * item.level * (100 - user.player.group.equipableReinforceCost)/100)
        
        let updateResult = await playerRepository.useMoney(user.player.id, cost)
        if (updateResult.affected === 0) {
            throw new Error("재화가 부족합니다.")
        }

        let grindRate: {[key in sharpnessDiff] : number} = deepCopy(ITEM_SHARPNESS_GRIND_RATE[item.sharpness])


        grindRate[sharpnessDiff.SUCCESS] += user.player.group.equipableReinforceSuccess
        if(grindRate[sharpnessDiff.SUCCESS] >= 100){
            grindRate[sharpnessDiff.SUCCESS] = 100
            grindRate[sharpnessDiff.FAIL] = 0
            grindRate[sharpnessDiff.SAME] = 0
        }
        else{
            grindRate[sharpnessDiff.FAIL] -= user.player.group.equipableReinforceSuccess
            if(grindRate[sharpnessDiff.FAIL]<0){
                grindRate[sharpnessDiff.SAME] += grindRate[sharpnessDiff.FAIL]
                grindRate[sharpnessDiff.FAIL] = 0
            }
        }

        const gachaRes = gachaMultipleDict(grindRate)
        const grindRes = parseInt(gachaRes) as sharpnessDiff

        if (grindRes === sharpnessDiff.SUCCESS) {
            let updateResult = await equipableItemRepository.increaseSharpness(item.id, item.sharpness)
            if (updateResult.affected === 0) {
                await playerRepository.earnMoney(user.player.id, cost)
                throw new Error("강화에 실패했습니다.")
            }
            await item.reload()
        } else if (grindRes === sharpnessDiff.SAME) {
            
        } else if (grindRes === sharpnessDiff.FAIL) {
            let updateResult = await equipableItemRepository.decreaseSharpness(item.id, item.sharpness)
            if (updateResult.affected === 0) {
                await playerRepository.earnMoney(user.player.id, cost)
                throw new Error("강화에 실패했습니다.")
            }
            await item.reload()
        }     

        return res.status(200).json({
            item: item,
            sharpnessDiff: grindRes,
            cost: cost,
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