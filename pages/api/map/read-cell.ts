// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { CellRepository } from 'src/repository/CellRepository'
import { Cell } from 'src/entity/Cell'

type Data = {
  cell?: Cell,
  message?: string
}

const schema = Joi.object({
    cellId: Joi.number()
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
    const { cellId } : { cellId: number } = req.body

    await prepareConnection()
    const cellRepository = getCustomRepository(CellRepository)
    try {
        const cell = await cellRepository.findOneById(cellId, ['region', 'adjEast', 'adjWest', 'adjSouth', 'adjNorth'])
        return res.status(200).json({
            cell: cell
        })
    } catch (err) {
        return res.status(404).json({
            message: '해당 지역은 존재하지 않습니다.'
        })
    }
}