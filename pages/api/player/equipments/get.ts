// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import { ItemRepository } from 'src/repository/ItemRepository'
import { ItemType } from 'src/enums/ItemType'
import { readToken } from 'src/lib/jwt'
import { UserRepository } from 'src/repository/UserRepository'
import { Equipments } from 'src/interfaces/Equipments'
import { WeaponEquipableItem } from 'src/entity/Item'

type Data = {
    equipments?: Equipments,
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']
    await prepareConnection()
    const itemRepository = getCustomRepository(ItemRepository)
    const userRepository = getCustomRepository(UserRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) {
            throw new Error("유저가 존재하지 않습니다.")
        }
        if (user.player == null) {
            throw new Error("플레이어가 존재하지 않습니다.")
        }
        const equipments = await getEquipments(user.player.id)
        return res.status(200).json({
            equipments: equipments
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

export async function getEquipments(playerId: number) {
    const itemRepository = getCustomRepository(ItemRepository)
    const equipedItems = await itemRepository.findEquiped(playerId)

    let equipments: Equipments = {
        Weapon: undefined,
        Accessory: undefined,
        Hair: undefined,
        Face: undefined,
        Suit: undefined,
        Deco: undefined,
    }
    for(let item of equipedItems){
        switch(item.itemInfo.itemType){
            case ItemType.WEAPON:
                equipments.Weapon = await itemRepository.findOne(item.id,{relations:["itemInfo", "enchantItemInfo"]})
                if ((equipments.Weapon as WeaponEquipableItem).enchantItemInfo === null) {
                    equipments.Weapon = item
                }
                break
            case ItemType.ACCESSORY:
                equipments.Accessory = item
                break
            case ItemType.HAIR:
                equipments.Hair = item
                break
            case ItemType.FACE:
                equipments.Face = item
                break
            case ItemType.SUIT:
                equipments.Suit = item
                break
            case ItemType.DECO:
                equipments.Deco = item
                break
            default:
                break
        }
    }
    return equipments
}
