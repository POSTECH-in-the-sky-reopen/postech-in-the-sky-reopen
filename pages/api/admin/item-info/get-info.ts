// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository, getRepository } from "typeorm"
import Joi from "joi"
import { ItemInfo } from 'src/entity/ItemInfo'
import { ItemInfoRepository } from 'src/repository/ItemInfoRepository'

type Data = {
    itemInfo?: ItemInfo
    message?: string
}

const schema = Joi.object({
    itemInfoId: Joi.number()
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
    const { itemInfoId }: { itemInfoId: number } = req.body
    await prepareConnection()
    const itemInfoRepository = getCustomRepository(ItemInfoRepository)
    try {
        const itemInfo = await itemInfoRepository.findOneById(itemInfoId)
        return res.status(200).json({
            itemInfo: itemInfo
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "알 수 없는 이유로 실패하였습니다."
        })
    }
}
