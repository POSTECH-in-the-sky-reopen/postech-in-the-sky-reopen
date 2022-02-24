// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { RegionRepository } from 'src/repository/RegionRepository'
import { Region } from 'src/entity/Region'

type Data = {
  region?: Region,
  message?: string
}

const schema = Joi.object({
    regionId: Joi.number()
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
    const { regionId } : { regionId: number } = req.body

    await prepareConnection()
    const regionRepository = getCustomRepository(RegionRepository)
    try {
        const promiseRegion = regionRepository.findOneById(regionId)
        const promiseCells = regionRepository.getCells(regionId)
        const [region, cells] = await Promise.all([promiseRegion, promiseCells])
        region.cells = cells
        return res.status(200).json({
            region: region
        })
    } catch (err) {
        return res.status(404).json({
            message: '해당 지역은 존재하지 않습니다.'
        })
    }
}