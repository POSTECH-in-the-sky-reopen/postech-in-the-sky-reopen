// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { calculateBaseStatus, improveStatusItem, Status, sumStatus } from 'src/interfaces/Status'
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { ItemType } from 'src/enums/ItemType'
import { EquipableItemInfo } from 'src/entity/ItemInfo'
import { EquipedInformation } from 'src/interfaces/EquipedInformation'
import { getEquipments } from 'pages/api/player/equipments/get'
import { Equipments } from 'src/interfaces/Equipments'
import { BASE_STATUS, EquipableItem, ITEM_ACCESSORY_STATUS_MAX_PER_SPECIALIZED, ITEM_ACCESSORY_STATUS_MIN_PER_SPECIALIZED, ITEM_SHARPNESS_INSANE_BONUS_MUL, ITEM_SHARPNESS_REASONABLE_MAX, ITEM_WEAPON_STATUS_MAX_PER_SPECIALIZED, ITEM_WEAPON_STATUS_MIN_PER_SPECIALIZED, WeaponEquipableItem } from 'src/entity/Item'

type Data = {
    status?: Status
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    const playerRepository = getCustomRepository(PlayerRepository)
    const userRepository = getCustomRepository(UserRepository)
    const token = req.cookies['token']
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) {
            throw new Error("해당 학번에 해당하는 유저가 없습니다.")
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.")
        }

        const equipments = await getEquipments(user.player.id)
        const equipedInfo = getEquipedInformation(equipments)
        return res.status(200).json({
            status: equipedInfo.status
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

export function getEquipedInformation(equipments: Equipments): EquipedInformation {
    let status: Status = BASE_STATUS
    if (equipments.Weapon !== undefined) {
        let weaponStatus = getEquipableItemStatus(equipments.Weapon as EquipableItem)
        status = sumStatus(status, weaponStatus)
    }
    if (equipments.Accessory !== undefined) {
        let accessoryStatus = getEquipableItemStatus(equipments.Accessory as EquipableItem)
        status = sumStatus(status, accessoryStatus)
    }
    return {
        status: status,
        attackBattleType: (equipments.Weapon?.itemInfo as EquipableItemInfo).battleType,
        defenseBattleType: (equipments.Accessory?.itemInfo as EquipableItemInfo).battleType,
        enchantItemInfo: (equipments.Weapon as WeaponEquipableItem)?.enchantItemInfo
    }
}


export function getEquipableItembasicStatus(equipableItem: EquipableItem) {
    const specialized = (equipableItem.itemInfo as EquipableItemInfo).specialized
    const sharpness = equipableItem.sharpness
    const ration = sharpness < ITEM_SHARPNESS_REASONABLE_MAX ?
        sharpness / ITEM_SHARPNESS_REASONABLE_MAX : 
        1 + ((sharpness - ITEM_SHARPNESS_REASONABLE_MAX) * ITEM_SHARPNESS_INSANE_BONUS_MUL / ITEM_SHARPNESS_REASONABLE_MAX)

    let status_min_map, status_max_map
    if (equipableItem.itemType === ItemType.WEAPON) {
        status_min_map = ITEM_WEAPON_STATUS_MIN_PER_SPECIALIZED
        status_max_map = ITEM_WEAPON_STATUS_MAX_PER_SPECIALIZED
    } else if (equipableItem.itemType === ItemType.ACCESSORY) {
        status_min_map = ITEM_ACCESSORY_STATUS_MIN_PER_SPECIALIZED
        status_max_map = ITEM_ACCESSORY_STATUS_MAX_PER_SPECIALIZED
    } else {
        throw new Error()
    }
    let baseStatus = calculateBaseStatus(status_min_map[specialized], status_max_map[specialized], ration)
    return baseStatus
}

export function getEquipableItemStatus(equipableItem: EquipableItem) {
    const basicStatus = getEquipableItembasicStatus(equipableItem)
    return improveStatusItem(equipableItem.level, basicStatus)
}