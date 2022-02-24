// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { ItemInfo } from 'src/entity/ItemInfo'
import { ItemRepository } from 'src/repository/ItemRepository'

type Data = {
    itemInfo?: ItemInfo
    message?: string
}

const schema = Joi.object({
    itemId: Joi.number()
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
    const { itemId }: { itemId: number } = req.body
    await prepareConnection()
    try {
        const itemInfo = await getItemInfo(itemId)
        if(itemInfo === undefined){
            return res.status(404).json({
                message: "아이템 또는 아이템 정보가 존재하지 않습니다."
            })
        }
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

export async function getItemInfo(itemId:number) {
    const itemRepository = getCustomRepository(ItemRepository)
    const item = await itemRepository.findOne(itemId, {relations: ["itemInfo"]})
    if(item == undefined){
        throw new Error("아이템이 없습니다.")
    }
    return item.itemInfo
}