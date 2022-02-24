// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { EquipableItemRepository } from 'src/repository/ItemRepository'
import { readToken } from 'src/lib/jwt'
import { UserRepository } from 'src/repository/UserRepository'

type Data = {
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
    const token = req.cookies['token']
    const validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message
        })
    }
    const { itemId }: { itemId: number } = req.body
    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const equipableItemRepository = getCustomRepository(EquipableItemRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) {
            throw new Error("해당하는 유저가 없습니다.")
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.")
        }
        const updateResult = await equipableItemRepository.removeFake(itemId, user.player)
        if (updateResult.affected === 0) {
            throw new Error("수리에 실패했습니다.")
        }
        return res.status(200).json({})
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