// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getCustomRepository } from "typeorm";
import Joi from "joi";
import prepareConnection from "src/lib/db";
import { CellRepository } from "src/repository/CellRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";
import { GroupInfo } from "src/entity/GroupInfo";

type Data = {
    group?: GroupInfo,
    message?: string;
};

const schema = Joi.object({
    playerId: Joi.number().required(),
    groupNum: Joi.number().required(),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body);
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message,
        });
    }
    const { playerId, groupNum }: { playerId: number, groupNum: number } = req.body;

    await prepareConnection();
    const playerRepository = getCustomRepository(PlayerRepository);
    const groupRepository = getCustomRepository(GroupInfoRepository) 
    try {
        //const player = await playerRepository.findOne(playerId);
        //if (player === undefined) {
        //    throw new Error("no player");
        //}
        const group = await groupRepository.getByNum(groupNum)
        if(group === undefined){
            throw new Error("no group")
        }
        await playerRepository.update(playerId, {
            group: group
        })
        return res.status(200).json({
            group: group,
            message: "success"
        })
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
