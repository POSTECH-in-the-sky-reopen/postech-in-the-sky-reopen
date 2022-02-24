// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from "joi";
import type { NextApiRequest, NextApiResponse } from "next";
import { Player } from "src/entity/Player";
import prepareConnection from "src/lib/db";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { getCustomRepository } from "typeorm";

type Data = {
    members?: Player[];
    message?: string;
};

const schema = Joi.object({
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
    const { groupNum }: { groupNum: number } = req.body;
    await prepareConnection();
    const playerRepository = getCustomRepository(PlayerRepository);
    try {
        const players = await playerRepository.getPlayersByGroupNum(groupNum);
        return res.status(200).json({ members: players });
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
