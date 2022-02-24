// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { ItemCollectionRepository } from "src/repository/ItemCollectionRepository";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";
import { checkMark } from "src/util/Mark";
import { deepCopy } from "src/util/DeepCopy";
import { addEffect, Effect, getEffect } from "src/util/EffectList";

type Data = {
    effects?: Effect[]
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
        let effects = []
        for(let i = 1; i < 16; i++){
            const group = await groupRepository.getByNum(i)
            if(group === undefined){
                throw new Error("no group")
            }

            let effect: Effect = deepCopy({
                coordiCost: 0,
                enchantDrop: 0,
                enchantSuccess: 0,
                equipableDrop: 0,
                equipableReinforceCost: 0,
                equipableReinforceSuccess: 0,
                fatigueIncrease: 0,
                moneyEarn: 0
            })

            for(let c = 0; c < group.itemCollections.length; c++){
                const itemCollection = await itemCollectionRepository.findOne(group.itemCollections[c].id,{relations:["itemInfos"]})
                if(itemCollection===undefined){
                    continue
                }
                // console.log(itemCollection.itemInfos)
                // console.log(addEffect(effect,getEffect(itemCollection.name)))
                if(checkMark(+group.collectionMarks[c],itemCollection.itemInfos)){
                    effect = deepCopy(addEffect(effect,getEffect(itemCollection.name)))
                }
            }
            effects.push(effect)
            await groupRepository.updateBonusEffect(group.id, deepCopy(effect))
        }

        return res.status(200).json({
            effects: effects
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
