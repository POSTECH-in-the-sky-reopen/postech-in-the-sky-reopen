// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { CellRepository } from 'src/repository/CellRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { BattleType } from 'src/enums/BattleType'
import { RegionRepository } from 'src/repository/RegionRepository'

type Data = {
  id?: number,
  message?: string
}

const schema = Joi.object({
    name: Joi.string()
        .max(30)
        .required(),
    regionId: Joi.number()
        .required(),
    battleType: Joi.number()
        .required(),
    isCapturable: Joi.boolean()
        .required(),
    isTeleportable: Joi.boolean()
        .required(),
    isEnding: Joi.boolean()
        .required(),
    cellLevel: Joi.number()
        .required(),
    // 이하는 필수 아님
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
    const { name, regionId, battleType, 
        isCapturable, isTeleportable, isEnding, cellLevel,
        adjEastId, adjWestId, adjSouthId, adjNorthId
    } : { name: string, regionId: number, battleType: BattleType, 
        isCapturable: boolean, isTeleportable: boolean, isEnding: boolean, cellLevel: number,
        adjEastId: number, adjWestId: number, adjSouthId: number, adjNorthId: number 
    } = req.body

    await prepareConnection()
    const cellRepository = getCustomRepository(CellRepository)
    const regionRepository = getCustomRepository(RegionRepository)
    try {
        const promiseRegion = regionRepository.findOneById(regionId)
        const promiseAdjCells = cellRepository.findByIds([adjEastId, adjWestId, adjSouthId, adjNorthId])
        const [region, adjCells] = await Promise.all([promiseRegion, promiseAdjCells])
        const cell = await cellRepository.createAndSave(name, region, battleType,
            isCapturable, isTeleportable, isEnding, cellLevel,
            adjCells)
        return res.status(201).json({
            id: cell.id
        })
    } catch (err) {
        console.error(err)
        return res.status(409).json({
            message: '같은 이름을 가진 셀이 이미 존재합니다.'
        })
    }
}
