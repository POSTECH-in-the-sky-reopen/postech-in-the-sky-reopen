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
import { PlayerRepository } from "src/repository/PlayerRepository";
import { Achievement } from "src/entity/Achievement";
import { AchievementRepository } from "src/repository/AchievementRepository";

interface CloudTowerFriend extends Friend{
    floor: number
    group: number
}

type Data = {
    ranking?: CloudTowerFriend[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    const playerRepository = getCustomRepository(PlayerRepository);
    const achievementRepository = getCustomRepository(AchievementRepository)
    try {
        const top10 = await playerRepository.createQueryBuilder("player")
            .leftJoinAndSelect("player.achievement","achievement")
            .leftJoinAndSelect("player.honored","honored")
            .leftJoinAndSelect("player.location","location")
            .leftJoinAndSelect("player.group","group")
            .where('achievement.cloudTowerFloor > 0')
            .andWhere('group.num > 0')
            .orderBy("achievement.cloudTowerFloor","DESC")
            .limit(10)
            .getMany()

        let playerRanking = [];

        for (let player of top10) {
            playerRanking.push({
                equipments: await getEquipments(player.id),
                floor: player.achievement.cloudTowerFloor,
                honored: selectHonored(player.honored.names, player.honored.honoredInd),
                location: player.location,
                name: player.name,
                group: player.group.num,
                recentAccessedAt: getFriendDate(player.updatedAt)
            } as CloudTowerFriend)
        }

        return res.status(200).json({
            ranking: playerRanking,
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
