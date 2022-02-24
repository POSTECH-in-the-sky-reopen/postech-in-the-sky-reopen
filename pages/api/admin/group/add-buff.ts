// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { ItemCollectionRepository } from "src/repository/ItemCollectionRepository";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";
import { checkMark } from "src/util/Mark";
import { deepCopy } from "src/util/DeepCopy";
import { addEffect, Effect, getEffect } from "src/util/EffectList";
import Joi from "joi";

type Data = {
    message?: string;
};

const schema = Joi.object({
    groupNum: Joi.number().required(),
    coordiCost: Joi.number(),
    enchantDrop: Joi.number(),
    enchantSuccess: Joi.number(),
    equipableDrop: Joi.number(),
    equipableReinforceCost: Joi.number(),
    equipableReinforceSuccess: Joi.number(),
    fatigueIncrease: Joi.number(),
    moneyEarn: Joi.number(),
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
        groupNum,
        coordiCost,
        enchantDrop,
        enchantSuccess,
        equipableDrop,
        equipableReinforceCost,
        equipableReinforceSuccess,
        fatigueIncrease,
        moneyEarn,
    }: {
        groupNum: number;
        coordiCost: number;
        enchantDrop: number;
        enchantSuccess: number;
        equipableDrop: number;
        equipableReinforceCost: number;
        equipableReinforceSuccess: number;
        fatigueIncrease: number;
        moneyEarn: number;
    } = req.body;

    await prepareConnection();
    try {
        const groupRepository = getCustomRepository(GroupInfoRepository);

        const group = await groupRepository.getByNum(groupNum);
        if (group === undefined) {
            throw new Error("no group");
        }

        let effect: Effect = deepCopy({
            coordiCost: coordiCost,
            enchantDrop: enchantDrop,
            enchantSuccess: enchantSuccess,
            equipableDrop: equipableDrop,
            equipableReinforceCost: equipableReinforceCost,
            equipableReinforceSuccess: equipableReinforceSuccess,
            fatigueIncrease: fatigueIncrease,
            moneyEarn: moneyEarn,
        });

        groupRepository.updateBonusEffect(group.id, addEffect(group, effect));

        return res.status(201).json({});
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
