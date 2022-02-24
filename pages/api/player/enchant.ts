// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { ItemRepository, WeaponEquipableItemRepository } from 'src/repository/ItemRepository'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { ItemType } from 'src/enums/ItemType'
import { readToken } from 'src/lib/jwt'
import { UserRepository } from 'src/repository/UserRepository'
import { EnchantItemInfo } from 'src/entity/ItemInfo'
import { WeaponEquipableItem } from 'src/entity/Item'
import { EnchantItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { gacha } from 'src/lib/random'

type Data = {
    success: boolean
    message?: string
}

const schema = Joi.object({
    weaponId: Joi.number()
        .required(),
    enchantId: Joi.number()
        .required()
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            success: false,
            message: validateRes.error.message
        })
    }
    const token = req.cookies['token']
    const { weaponId, enchantId }: { weaponId: number, enchantId: number } = req.body
    await prepareConnection()
    const itemRepository = getCustomRepository(ItemRepository)
    const weaponEquipableItemRepository = getCustomRepository(WeaponEquipableItemRepository)
    const userRepository = getCustomRepository(UserRepository)
    const enchantItemInfoRepository = getCustomRepository(EnchantItemInfoRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player", "player.group"] })
        if (user === undefined) {
            throw new Error("유저가 존재하지 않습니다.");
        }
        if (user.player === null) {
            throw new Error("플레이어가 존재하지 않습니다.")
        }
        const weapon = await itemRepository.findOne({
            id: weaponId,
            player: { id: user.player.id },
        })
        const enchant = await itemRepository.findOne({
            id: enchantId,
            player: { id: user.player.id },
        })
        if (weapon === undefined || enchant === undefined) {
            throw new Error("아이템이 존재하지 않습니다.")
        }
        if (weapon.itemType !== ItemType.WEAPON) {
            throw new Error("인챈트 대상이 무기가 아닙니다.")
        }
        if (enchant.itemType !== ItemType.ENCHANT) {
            throw new Error("인챈트 아이템이 아닙니다.")
        }
        let success = false
        const enchantItemInfo = enchant.itemInfo as EnchantItemInfo
        await enchant.remove()
        if (gacha(enchantItemInfo.enchantSuccess + user.player.group.enchantSuccess)) {
            let updateResult = await weaponEquipableItemRepository.updateEnchant(weapon.id, enchantItemInfo)
            if (updateResult.affected === 0) {
                throw new Error("인챈트를 시도했으나 실패했습니다.")
            }
            success = true
        }
        return res.status(200).json({
            success: success
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                success: false,
                message: err.message
            })
        } else {
            console.error(err)
            return res.status(500).json({
                success: false,
                message: '알 수 없는 오류가 발생했습니다.'
            })
        }
    }
}