// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { PhaseRepository } from 'src/repository/PhaseRepository'


type Data = {
    message?: string
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    try {
        const phaseRepository = getCustomRepository(PhaseRepository)

        await phaseRepository.update({},{
            phase: () => `phase + 1`
        })

        return res.status(201).json({
            
        })
    } catch (err) {
        return res.status(409).json({
            message: '알 수 없는 이유로 실패했습니다.'
        })
    }
}
