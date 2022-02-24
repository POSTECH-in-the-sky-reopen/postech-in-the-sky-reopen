// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { PhaseRepository } from 'src/repository/PhaseRepository'


type Data = {
    message?: string
}


const schema = Joi.object({
    num: Joi.number()
        .required(),
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
    const { num }: { num: number } = req.body
    await prepareConnection()
    try {
        const phaseRepository = getCustomRepository(PhaseRepository)
        const phase = (await phaseRepository.find())[0]

        await phaseRepository.updatePhase(phase.id, num)

        return res.status(201).json({
            
        })
    } catch (err) {
        return res.status(409).json({
            message: '알 수 없는 이유로 실패했습니다.'
        })
    }
}
