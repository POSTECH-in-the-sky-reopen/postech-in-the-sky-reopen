// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { ItemRepository } from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";
import Joi from "joi";
import { HonoredRepository } from "src/repository/HonoredRepository";

type Data = {
    honored?: string
    message?: string;
};

const schema = Joi.object({
    selected: Joi.number(),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body, { allowUnknown: true });
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message,
        });
    }
    let {
        selected,
    }: { selected: number } =
        req.body;
    await prepareConnection();
    const honoredRepository = getCustomRepository(HonoredRepository)
    const itemRepository = getCustomRepository(ItemRepository);
    const playerRepository = getCustomRepository(PlayerRepository);
    const userRepository = getCustomRepository(UserRepository);
    const token = req.cookies["token"];
    try {
        const payload = readToken(token);
        const studentId = payload.studentId;
        const user = await userRepository.findOne(
            {
                studentId: studentId,
            },
            { relations: ["player", "player.honored"] }
        );
        if (user === undefined) {
            throw new Error("해당하는 유저가 없습니다.");
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.");
        }

        await honoredRepository.updateHonoredInd(user.player.honored.id, selected)
        
        return res.status(200).json({
            honored: selectHonored(user.player.honored.names,selected)
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(404).json({
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

export function selectHonored(honoreds: string[], idx: number): string|undefined{
    if(0<=idx&&idx<honoreds.length){
        return honoreds[idx]
    }
    return undefined
}