// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { Friend, getFriendDate } from "src/interfaces/Friend";
import { SiegeRepository } from "src/repository/SiegeRepository";
import { PhaseRepository } from "src/repository/PhaseRepository";
import { getEquipments } from "pages/api/player/equipments/get";
import { GroupInfo } from "src/entity/GroupInfo";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";
import { selectHonored } from "pages/api/player/achievement/select";

type Data = {
    ranking?: Friend[];
    damages?: number[];
    groups?: number[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    const userRepository = getCustomRepository(UserRepository);
    const token = req.cookies["token"];
    const siegeRepository = getCustomRepository(SiegeRepository);
    const phaseRepository = getCustomRepository(PhaseRepository);
    try {
        const payload = readToken(token);
        const studentId = payload.studentId;
        const user = await userRepository.findOne(
            {
                studentId: studentId,
            },
            { relations: ["player", "player.location"] }
        );
        if (user === undefined) {
            throw new Error("해당 학번에 해당하는 유저가 없습니다.");
        }
        const phase = (await phaseRepository.findOneOrFail()).phase;

        const siegeRanking = await siegeRepository
            .createQueryBuilder()
            .where({ phase: phase })
            .andWhere({ cell: user.player.location })
            .orderBy("damage", "DESC")
            .getMany();

        let playerRanking = [];
        let damages = [];
        let groups = [];

        for (let i = 0; i < Math.min(3, siegeRanking.length); i++) {
            const siege = await siegeRepository.findOne(siegeRanking[i].id, {
                relations: ["player", "player.location", "player.group", "player.honored"],
            });
            if (siege === undefined) {
                throw new Error("no siege");
            }
            if (siege.player.group.num === 0) {
                continue
            }
            playerRanking.push({
                name: siege.player.name,
                honored: selectHonored(siege.player.honored.names,siege.player.honored.honoredInd),
                equipments: await getEquipments(siege.player.id),
                location: siege.player.location,
                recentAccessedAt: getFriendDate(siege.player.updatedAt),
            });
            damages.push(siege.damage)
            groups.push(siege.player.group.num)
        }

        return res.status(200).json({
            ranking: playerRanking,
            damages: damages,
            groups: groups
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
