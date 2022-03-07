// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { CoordiItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { ItemType } from 'src/enums/ItemType'
import { CoordiItemInfo } from 'src/entity/ItemInfo'

type Data = {
    coordiItemInfos?: CoordiItemInfo[]
    message?: string
}

const schema = Joi.object({
    coordiType: Joi.number()
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

    const { coordiType }: { coordiType: ItemType } = req.body
    await prepareConnection()
    const coordiItemInfoRepository = getCustomRepository(CoordiItemInfoRepository)
    try {

        if (coordiType === ItemType.FACE || coordiType === ItemType.HAIR || coordiType === ItemType.SUIT || coordiType === ItemType.DECO) {
            const coordiItemInfos = await coordiItemInfoRepository.createQueryBuilder()
                .where("itemType = :type", { type: coordiType })
                .orderBy("RAND()")
                .getMany()
            return res.status(200).json({
                coordiItemInfos: coordiItemInfos,
            })

        } else {
            throw new Error("코디 아이템 종류가 아닙니다.")
        }

    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            console.error(err)
            return res.status(500).json({
                message: '알 수 없는 오류가 발생했습니다.'
            })
        }
    }
}