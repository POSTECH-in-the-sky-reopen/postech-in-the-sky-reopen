// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { ItemCollectionRepository } from "src/repository/ItemCollectionRepository";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";

type Data = {
    message?: string;
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    try {
        const groupRepository = getCustomRepository(GroupInfoRepository);
        const itemCollectionRepository = getCustomRepository(ItemCollectionRepository)
        const [itemCollections, count]  = await itemCollectionRepository.findAndCount()
        for(let i = 1; i < 16; i++){
            const group = await groupRepository.getByNum(i)
            if(group === undefined){
                throw new Error("no group")
            }
            group.itemCollections = itemCollections.filter(c=>group.itemCollections.map(l=>l.id).indexOf(c.id))
            group.collectionMarks = Array(count).fill(0)
            await group.save()
        }

        return res.status(201).json({
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
