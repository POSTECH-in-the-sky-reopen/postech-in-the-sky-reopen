// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { PhaseRepository } from 'src/repository/PhaseRepository'
import { Phase } from 'src/entity/Phase'


type Data = {
    phase?: number
    message?: string
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    try {
        const phaseRepository = getCustomRepository(PhaseRepository)

        const phase = await phaseRepository.findOneOrFail()

        return res.status(200).json({
            phase: phase.phase
        })
    } catch (err) {
        return res.status(409).json({
            message: '알 수 없는 이유로 실패했습니다.'
        })
    }
}
