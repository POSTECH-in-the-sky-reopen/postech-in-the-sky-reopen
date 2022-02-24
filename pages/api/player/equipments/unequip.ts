// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { ItemType } from 'src/enums/ItemType'
import { ItemRepository } from 'src/repository/ItemRepository'
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { Item } from 'src/entity/Item'

type Data = {
    previous?: Item
    message?: string
}

const schema = Joi.object({
    itemType: Joi.number()
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
    const { itemType}: { itemType: ItemType } = req.body

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
        if(player === undefined) throw new Error()
        
        let previous = await itemRepository.findOne({
            player: { id: player.id },
            equiped: true,
            itemType: itemType,
        })
        if (previous === undefined) {
            return res.status(409).json({
                message: "해당 아이템 종류를 장착하고 있지 않습니다."
            })
        }
        previous.equiped = false
        previous = await previous.save()

        return res.status(200).json({
            previous: previous,
            message: "장착 해제하였습니다."
        })
    } catch (err) {
        return res.status(500).json({
            message: "알 수 없는 이유로 실패하였습니다."
        })
    }
}