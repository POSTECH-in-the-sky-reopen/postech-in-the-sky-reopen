// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { RegionRepository } from 'src/repository/RegionRepository'
import { Region } from 'src/entity/Region'

type Data = {
  regions?: Region[],
  message?: string
}

const schema = Joi.object({
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

    await prepareConnection()
    const regionRepository = getCustomRepository(RegionRepository)
    try {
        const regions = await regionRepository.find({})
        return res.status(200).json({
            regions: regions
        })
    } catch (err) {
        return res.status(404).json({
            message: '지역을 가져오지 못했습니다.'
        })
    }
}