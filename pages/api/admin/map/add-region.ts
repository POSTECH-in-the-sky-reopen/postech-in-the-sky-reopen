// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { RegionRepository } from 'src/repository/RegionRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"

type Data = {
  id?: number,
  message?: string
}

const schema = Joi.object({
    name: Joi.string()
        .max(30)
        .required(),
    level: Joi.number()
        .integer()
        .min(0)
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
    const { name, level } : { name: string, level: number } = req.body

    await prepareConnection()
    const regionRepository = getCustomRepository(RegionRepository)
    try {
        const region = await regionRepository.createAndSave(name, level)
        return res.status(201).json({
            id: region.id
        })
    } catch (err) {
        return res.status(409).json({
            message: '같은 이름을 가진 지역이 이미 존재합니다.'
        })
    }
}