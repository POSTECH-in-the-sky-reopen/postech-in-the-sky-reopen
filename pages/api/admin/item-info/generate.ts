// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { ItemInfo, MAX_ITEMINFO_DESCRIPTION_LENGTH, MAX_ITEMINFO_NAME_LENGTH } from 'src/entity/ItemInfo'
import { ItemInfoRepository, EquipableItemInfoRepository, CoordiItemInfoRepository, EnchantItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { ItemType, Layer, Specialized } from 'src/enums/ItemType'
import { Status } from 'src/interfaces/Status'
import { BattleType } from 'src/enums/BattleType'

type Data = {
    itemInfo?: ItemInfo
    message?: string
}

const commonSchema = Joi.object({
    // 모든 경우에 이름과 타입을 명시, 타입은 /src/enums/ItemType 참조
    name: Joi.string()
        .max(MAX_ITEMINFO_NAME_LENGTH)
        .required(),
    description: Joi.string()
        .max(MAX_ITEMINFO_DESCRIPTION_LENGTH)
        .required(),
    itemType: Joi.number()
        .required(),
})

const equipableSchema = Joi.object({
    // 장비 아이템(무기, 장신구)의 경우
    // 특화, 속성, 초기 내구도 명시
    specialized: Joi.number()
        .required(),
    battleType: Joi.number()
        .required(),
    durability: Joi.number()
        .required()
})

const coordiSchema = Joi.object({
    // 필요한 사진의 레이어
    layers: Joi.array()
        .items(Joi.number())
        .required()
})

const enchantSchema = Joi.object({
    // 인챈트 아이템인 경우
    // 인챈트 아이템의 효과 명시
    enchantSuccess: Joi.number()
        .required(),
    onStart: Joi.boolean()
        .required(),
    onTurn: Joi.boolean()
        .required(),
    special: Joi.number()
        .required(),
    isChangeBattleType: Joi.boolean()
        .required(),
    battleType: Joi.number()
        .required(),
    startStatus: Joi.object({
        attack: Joi.number()
            .required(),
        defense: Joi.number()
            .required(),
        hpmax: Joi.number()
            .required(),
        luck: Joi.number()
            .required(),
    }).required(),
    effectStatusToSelf: Joi.object({
        attack: Joi.number()
            .required(),
        defense: Joi.number()
            .required(),
        hpmax: Joi.number()
            .required(),
        luck: Joi.number()
            .required(),
    }).required(),
    effectStatusToEnemy: Joi.object({
        attack: Joi.number()
            .required(),
        defense: Joi.number()
            .required(),
        hpmax: Joi.number()
            .required(),
        luck: Joi.number()
            .required(),
    }).required(),
    attackCount: Joi.number()
        .required(),
    attackTurn: Joi.number()
        .required(),
    isDroppable: Joi.boolean()
        .required(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let validateRes = commonSchema.validate(req.body, { allowUnknown: true })
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message
        })
    }
    const { name, description, itemType }: {
        name: string,
        description: string,
        itemType: ItemType,
    } = req.body

    await prepareConnection()
    try {
        const itemInfoRepository = getCustomRepository(ItemInfoRepository)
        await itemInfoRepository.assureNonexistByName(name)
        let itemInfo: ItemInfo | undefined = undefined
        if (itemType === ItemType.WEAPON || itemType === ItemType.ACCESSORY) {
            validateRes = equipableSchema.validate(req.body, { allowUnknown: true })
            if (validateRes.error) {
                return res.status(400).json({
                    message: validateRes.error.message
                })
            }
            const { specialized, battleType, durability }: {
                specialized: Specialized,
                battleType: BattleType
                durability: number
            } = req.body

            const equipableItemInfoRepository = getCustomRepository(EquipableItemInfoRepository)
            itemInfo = await equipableItemInfoRepository.createAndSave(name, description, itemType, specialized, battleType, durability)
        }
        else if (itemType === ItemType.FACE || itemType === ItemType.HAIR || itemType === ItemType.SUIT || itemType === ItemType.DECO) {
            validateRes = coordiSchema.validate(req.body, { allowUnknown: true })
            if (validateRes.error) {
                return res.status(400).json({
                    message: validateRes.error.message
                })
            }
            const { layers }: { layers: Layer[] } = req.body

            const coordiItemInfoRepository = getCustomRepository(CoordiItemInfoRepository)
            itemInfo = await coordiItemInfoRepository.createAndSave(name, description, itemType, layers)
        }
        else if (itemType === ItemType.ENCHANT) {
            validateRes = enchantSchema.validate(req.body, { allowUnknown: true })
            if (validateRes.error) {
                return res.status(400).json({
                    message: validateRes.error.message
                })
            }
            const { enchantSuccess, onStart, onTurn, special, isChangeBattleType,
                battleType, startStatus,
                effectStatusToSelf, effectStatusToEnemy,
                attackCount, attackTurn, isDroppable }: {
                    enchantSuccess: number,
                    onStart: boolean,
                    onTurn: boolean,
                    special: number,
                    isChangeBattleType: boolean,
                    battleType: BattleType,
                    startStatus: Status,
                    effectStatusToSelf: Status,
                    effectStatusToEnemy: Status,
                    attackCount: number,
                    attackTurn: number,
                    isDroppable: boolean,
                } = req.body

            const enchantItemInfoRepository = getCustomRepository(EnchantItemInfoRepository)
            itemInfo = await enchantItemInfoRepository.createAndSave(
                name, description, itemType, enchantSuccess, onStart, onTurn, special, isChangeBattleType,
                battleType, startStatus,
                effectStatusToSelf, effectStatusToEnemy,
                attackCount, attackTurn,
                isDroppable
            )
        }

        if (itemInfo === undefined) throw new Error()
        return res.status(201).json({
            itemInfo: itemInfo,
            message: ''
        })
    } catch (err) {
        return res.status(409).json({
            message: '같은 이름을 가진 아이템이 이미 존재합니다.'
        })
    }
}
