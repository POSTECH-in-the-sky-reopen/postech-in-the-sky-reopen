// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { ItemCollectionRepository } from "src/repository/ItemCollectionRepository";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";
import { checkMark } from "src/util/Mark";
import { deepCopy } from "src/util/DeepCopy";
import { addEffect, Effect, getEffect, getEffectDetail } from "src/util/EffectList";
import Joi from "joi";

type Data = {
    message?: string;
};

const schema = Joi.object({
    groupNum: Joi.number().required(),
    effectName: Joi.string().required(),
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
        effectName
    }: {
        groupNum: number;
        effectName: string
    } = req.body;

    await prepareConnection();
    try {
        const groupRepository = getCustomRepository(GroupInfoRepository);

        const group = await groupRepository.getByNum(groupNum);
        if (group === undefined) {
            throw new Error("no group");
        }

        groupRepository.updateBonusEffect(group.id, addEffect(group, getEffect(effectName)));

        return res.status(200).json({
            message: getEffectDetail(getEffect(effectName))
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
