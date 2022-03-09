// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { UserRepository } from "src/repository/UserRepository";
import { getCustomRepository } from "typeorm";
import { readToken } from "src/lib/jwt";
import { ItemRepository } from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { COORDI_GACHA_COST } from "src/constants/shopCost";

type Data = {
    gachaCost?: number;
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies["token"];
    await prepareConnection();
    const itemRepository = getCustomRepository(ItemRepository);
    const userRepository = getCustomRepository(UserRepository);
    const playerRepository = getCustomRepository(PlayerRepository);
    try {
        const payload = readToken(token);
        const studentId = payload.studentId;
        let user = await userRepository.findOneByStudentIdSigned(studentId, [
            "player",
            "player.group"
        ]);
        let player = await playerRepository.findOne(user.player.id);
        if (player == undefined) {
            throw new Error("플레이어 정보가 없습니다.");
        }
        const coordiCount = (
            await itemRepository.getCoordiItems(player)
        ).length;
        const cost = ((COORDI_GACHA_COST + 5 * coordiCount) * (100 - user.player.group.coordiCost) / 100)
        return res.status(200).json({
            gachaCost: cost,
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
