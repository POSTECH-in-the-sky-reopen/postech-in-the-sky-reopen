// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import Joi from "joi";
import { getCustomRepository } from "typeorm";
import { ItemCollectionRepository } from "src/repository/ItemCollectionRepository";
import { ItemInfoRepository } from "src/repository/ItemInfoRepository";
import { ItemCollection } from "src/entity/ItemCollection";
import { ItemInfo } from "src/entity/ItemInfo";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";

type Data = {
    itemCollection?: ItemCollection;
    message?: string;
};

const schema = Joi.object({
    collectionName: Joi.string().required(),
    itemInfoNames: Joi.array().max(5).items(Joi.string()).required(),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let validateRes = schema.validate(req.body);
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message,
        });
    }
    const {
        collectionName,
        itemInfoNames,
    }: {
        collectionName: string;
        itemInfoNames: string[];
    } = req.body;

    await prepareConnection();
    try {
        const itemInfoRepository = getCustomRepository(ItemInfoRepository);
        const itemCollectionRepository = getCustomRepository(
            ItemCollectionRepository
        );
        let promiseList: Promise<ItemInfo>[] = [];
        for (let itemInfoName of itemInfoNames) {
            promiseList.push(itemInfoRepository.findOneByName(itemInfoName));
        }
        const itemInfos = await Promise.all(promiseList);
        const itemCollection = await itemCollectionRepository.createAndSave(
            collectionName,
            itemInfos,
        )
        return res.status(201).json({
            itemCollection: itemCollection,
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: "알 수 없는 오류가 발생했습니다.",
            });
        }
    }
}
