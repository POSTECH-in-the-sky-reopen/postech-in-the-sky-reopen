// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getCustomRepository } from "typeorm";
import { PlayerRepository } from "src/repository/PlayerRepository";
import Joi from "joi";
import prepareConnection from "src/lib/db";
import { PhaseRepository } from "src/repository/PhaseRepository";
import { SiegeRepository } from "src/repository/SiegeRepository";

type Data = {
    message?: string;
};

const schema = Joi.object({
    playerId: Joi.number().required(),
    damage: Joi.number().required(),
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
    const { playerId, damage }: { playerId: number; damage: number } = req.body;

    await prepareConnection();
    const phaseRepository = getCustomRepository(PhaseRepository);
    const siegeRepository = getCustomRepository(SiegeRepository);
    const playerRepository = getCustomRepository(PlayerRepository);
    try {
        const player = await playerRepository.findOne(playerId, {
            relations: ["location"],
        });
        const phase = (await phaseRepository.find())[0].phase;
        if (player == undefined) {
            throw new Error("no player");
        }
		if(!player.location.isCapturable){
			throw new Error("siege for only capturable");
		}
        const siege = await siegeRepository.makeSiege(
            player.location,
            player,
            phase,
            damage
        );
        return res.status(200).json({
			message: "success"
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
