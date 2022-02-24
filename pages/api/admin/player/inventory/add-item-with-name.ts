// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { ItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { CoordiItemRepository, EnchantItemRepository, EquipableItemRepository, ItemRepository } from 'src/repository/ItemRepository'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { CoordiItemInfo, EnchantItemInfo, EquipableItemInfo } from 'src/entity/ItemInfo'
import { Item } from 'src/entity/Item'
import { addItemManage } from 'src/util/ItemManagement'

type Data = {
    itemId?: number,
    message?: string
}

const schema = Joi.object({
    playerId: Joi.number()
        .required(),
    itemInfoName: Joi.string()
        .required(),
    itemLevel: Joi.number(),
    sharpness: Joi.number(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            itemId: -1,
            message: validateRes.error.message
        })
    }
    let { playerId, itemInfoName, itemLevel, sharpness }: {
        playerId: number, itemInfoName: string, 
        itemLevel: number|undefined, sharpness: number|undefined
    } = req.body
    
    await prepareConnection()
    const itemInfoRepository = getCustomRepository(ItemInfoRepository)
    const equipableItemRepository = getCustomRepository(EquipableItemRepository)
    const coordiItemRepository = getCustomRepository(CoordiItemRepository)
    const enchantItemRepository = getCustomRepository(EnchantItemRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    try {
        const player = await playerRepository.findOne(playerId)
        if (player === undefined) {
            throw new Error("플레이어가 존재하지 않습니다.")
        }
        const itemInfo = await itemInfoRepository.findOneByName(itemInfoName)
        if (itemInfo === undefined) {
            throw new Error("아이템 정보가 존재하지 않습니다.")
        }

        let item: Item
        if (itemInfo instanceof EquipableItemInfo) {
            itemLevel = itemLevel === undefined ? 0 : itemLevel
            sharpness = sharpness === undefined ? 0 : sharpness
            item = await equipableItemRepository.createAndSave(itemInfo, itemLevel, sharpness)
        } else if (itemInfo instanceof CoordiItemInfo) {
            item = await coordiItemRepository.createAndSave(itemInfo)
        } else if (itemInfo instanceof EnchantItemInfo) {
            item = await enchantItemRepository.createAndSave(itemInfo)
        } else {
            throw new Error("장비 아이템도 인챈트 아이템도 코디 아이템도 아닙니다.")
        }
        await addItemManage(player, item)
        return res.status(201).json({
            itemId: item.id
        })
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