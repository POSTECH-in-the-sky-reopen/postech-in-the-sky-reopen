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
import { UserRepository } from 'src/repository/UserRepository'

type Data = {
    itemId?: number,
    message?: string
}

const schema = Joi.object({
    studentId: Joi.number()
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
    let { studentId, itemInfoName, itemLevel, sharpness }: {
        studentId: number, itemInfoName: string, 
        itemLevel: number|undefined, sharpness: number|undefined
    } = req.body
    
    await prepareConnection()
    const itemInfoRepository = getCustomRepository(ItemInfoRepository)
    const userRepository = getCustomRepository(UserRepository)
    const equipableItemRepository = getCustomRepository(EquipableItemRepository)
    const coordiItemRepository = getCustomRepository(CoordiItemRepository)
    const enchantItemRepository = getCustomRepository(EnchantItemRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    try {
        const user = await userRepository.findOne({where: {studentId: studentId}, relations:["player"]})
        if (user === undefined) {
            throw new Error("??????????????? ???????????? ????????????.")
        }
        const itemInfo = await itemInfoRepository.findOneByName(itemInfoName)
        if (itemInfo === undefined) {
            throw new Error("????????? ????????? ???????????? ????????????.")
        }

        let item: Item
        if (itemInfo instanceof EquipableItemInfo) {
            itemLevel = itemLevel === undefined ? 0 : itemLevel
            sharpness = sharpness === undefined ? 0 : sharpness
            item = await equipableItemRepository.createAndSave(itemInfo, itemLevel, sharpness)
        } else if (itemInfo instanceof CoordiItemInfo) {
            const coordiItemExist = await coordiItemRepository.findOne({
                itemInfo: itemInfo,
                player: user.player
            })
            if(coordiItemExist !== undefined) {
                throw new Error("?????? ?????? ?????? ???????????????.")
            }
            item = await coordiItemRepository.createAndSave(itemInfo)
        } else if (itemInfo instanceof EnchantItemInfo) {
            item = await enchantItemRepository.createAndSave(itemInfo)
        } else {
            throw new Error("?????? ???????????? ????????? ???????????? ?????? ???????????? ????????????.")
        }
        await addItemManage(user.player, item)
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
                message: '??? ??? ?????? ????????? ??????????????????.'
            })
        }
    }
}