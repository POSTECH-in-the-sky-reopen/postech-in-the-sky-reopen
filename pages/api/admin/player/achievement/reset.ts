// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getCustomRepository } from "typeorm";
import Joi from "joi";
import prepareConnection from "src/lib/db";
import { HonoredRepository } from "src/repository/HonoredRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";

type Data = {
    message?: string;
};

const schema = Joi.object({
    playerId: Joi.number().required(),
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
    const { playerId}: { playerId: number; } = req.body;

    await prepareConnection();
    const playerRepository = getCustomRepository(PlayerRepository);
    const honoredRepository = getCustomRepository(HonoredRepository)
    try {
        const player = await playerRepository.findOne(playerId,{relations:["honored"]});
        if (player === undefined) {
            throw new Error("no player");
        }
        await honoredRepository.reset(player.honored.id)
        return res.status(200).json({
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
