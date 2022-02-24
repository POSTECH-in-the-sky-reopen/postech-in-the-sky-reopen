// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { MonsterInfoRepository } from 'src/repository/MonsterInfoRepository'

type Data = {
    message?: string
}

const schema = Joi.object({
    monsterInfoId: Joi.number()
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
    const { monsterInfoId }: { monsterInfoId: number } = req.body

    await prepareConnection()
    const monsterInfoRepository = getCustomRepository(MonsterInfoRepository)
    try {
        const deleteResult = await monsterInfoRepository.delete(monsterInfoId)
        if (deleteResult.affected === 0) {
            return res.status(404).json({
                message: "삭제를 실패했습니다."
            })
        }
        return res.status(200).json({})
    } catch (err) {
        return res.status(500).json({
            message: '알 수 없는 이유로 실패하였습니다.'
        })
    }
}