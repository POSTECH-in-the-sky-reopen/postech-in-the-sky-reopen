// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { ItemRepository } from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { Item } from "src/entity/Item";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";
import { Inventory } from "@mui/icons-material";
import Joi from "joi";
import { SortType } from "src/enums/SortType";
import { HonoredRepository } from "src/repository/HonoredRepository";

type Data = {
    honors?: string[]
    message?: string;
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
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

        return res.status(200).json({
            honors: user.player.honored.names
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
