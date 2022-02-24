// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { CellRepository } from 'src/repository/CellRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { Cell } from 'src/entity/Cell'

type Data = {
  cell?: Cell,
  message?: string
}

const schema = Joi.object({
    cellId: Joi.number()
        .required(),
    adjEastId: Joi.number(),
    adjWestId: Joi.number(),
    adjSouthId: Joi.number(),
    adjNorthId: Joi.number(),
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
    const { cellId, 
        adjEastId, adjWestId, adjSouthId, adjNorthId
    } : { cellId: number,
        adjEastId: number | undefined, adjWestId: number | undefined, adjSouthId: number | undefined, adjNorthId: number | undefined 
    } = req.body

    await prepareConnection()
    const cellRepository = getCustomRepository(CellRepository)
    try {
        const promiseCell = cellRepository.findOneById(cellId)
        let promiseAdj: Promise<Cell | null>[] = []
        promiseAdj.push(adjEastId === undefined
            ? new Promise((resolve, reject) => resolve(null))
            : cellRepository.findOneById(adjEastId))
        promiseAdj.push(adjWestId === undefined
            ? new Promise((resolve, reject) => resolve(null))
            : cellRepository.findOneById(adjWestId))
        promiseAdj.push(adjSouthId === undefined
            ? new Promise((resolve, reject) => resolve(null))
            : cellRepository.findOneById(adjSouthId))
        promiseAdj.push(adjNorthId === undefined
            ? new Promise((resolve, reject) => resolve(null))
            : cellRepository.findOneById(adjNorthId))

        const [cell, adjEast, adjWest, adjSouth, adjNorth]
            = await Promise.all([promiseCell as unknown].concat(promiseAdj))
        const resCell = await cellRepository.updateAndSave(cell as Cell, [adjEast as Cell, adjWest as Cell, adjSouth as Cell, adjNorth as Cell])
        return res.status(200).json({
            cell: resCell
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            message: '셀 업데이트를 실패하였습니다. 충돌하는 정보가 있는지 확인해주세요.'
        })
    }
}
