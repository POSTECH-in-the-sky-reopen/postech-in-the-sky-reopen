// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { readToken } from 'src/lib/jwt'
import { PlayerRepository } from 'src/repository/PlayerRepository'

type Data = {
    money?: number,
    message?: string
}

const schema = Joi.object({
    playerId: Joi.number()
        .required(),
    amount: Joi.number()
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
    const { playerId, amount }: { playerId: number, amount: number } = req.body

    await prepareConnection()
    const playerRepository = getCustomRepository(PlayerRepository)
    try {
        const player = await playerRepository.findOne(playerId)
        if (player === undefined) {
            throw new Error("플레이어가 존재하지 않습니다.")
        }
        const beforeMoney = player.money
        const afterMoney = beforeMoney + amount
        if (afterMoney < 0) {
            throw new Error("재화는 0보다 작아질 수 없습니다.")
        }

        await playerRepository.earnMoney(player.id, amount)
        return res.status(200).json({
            money: afterMoney
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