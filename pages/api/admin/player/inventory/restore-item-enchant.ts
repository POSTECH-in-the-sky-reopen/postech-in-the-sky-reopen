// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { ItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { CoordiItemRepository, EnchantItemRepository, EquipableItemRepository, ItemRepository, WeaponEquipableItemRepository } from 'src/repository/ItemRepository'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { CoordiItemInfo, EnchantItemInfo, EquipableItemInfo } from 'src/entity/ItemInfo'
import { Item } from 'src/entity/Item'
import { addItemManage } from 'src/util/ItemManagement'
import { UserRepository } from 'src/repository/UserRepository'
import { ItemType } from 'src/enums/ItemType'

type Data = {
    itemId?: number,
    message?: string
}

const schema = Joi.object({
    studentId: Joi.number()
        .required(),
    itemInfoName: Joi.string()
        .required(),
    itemLevel: Joi.number().required(),
    sharpness: Joi.number(),
    enchantInfo: Joi.string().required()
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
    let { studentId, itemInfoName, itemLevel, sharpness, enchantInfo }: {
        studentId: number, itemInfoName: string, 
        itemLevel: number, sharpness: number, enchantInfo: string
    } = req.body
    
    await prepareConnection()
    const itemInfoRepository = getCustomRepository(ItemInfoRepository)
    const userRepository = getCustomRepository(UserRepository)
    const equipableItemRepository = getCustomRepository(EquipableItemRepository)
    const coordiItemRepository = getCustomRepository(CoordiItemRepository)
    const enchantItemRepository = getCustomRepository(EnchantItemRepository)
    const weaponEquipableItemRepository = getCustomRepository(WeaponEquipableItemRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    try {
        const user = await userRepository.findOne({where: {studentId: studentId}, relations:["player"]})
        if (user === undefined) {
            throw new Error("플레이어가 존재하지 않습니다.")
        }
        const itemInfo = await itemInfoRepository.findOneByName(itemInfoName)
        if (itemInfo === undefined) {
            throw new Error("아이템 정보가 존재하지 않습니다.")
        }
        const enchantItemInfo = await itemInfoRepository.findOneByName(enchantInfo)
        if (enchantItemInfo === undefined) {
            throw new Error("아이템 정보가 존재하지 않습니다.")
        }
        let item: Item
        if(itemInfo.itemType !== ItemType.WEAPON || enchantItemInfo.itemType !== ItemType.ENCHANT){
            throw new Error("인챈트가 불가한 종류의 아이템입니다.")
        }
        item = await equipableItemRepository.createAndSave(itemInfo, itemLevel, sharpness)
        let updateResult = await weaponEquipableItemRepository.updateEnchant(item.id, enchantItemInfo as EnchantItemInfo)
        if (updateResult.affected === 0) {
            throw new Error("인챈트를 시도했으나 실패했습니다.")
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
                message: '알 수 없는 오류가 발생했습니다.'
            })
        }
    }
}