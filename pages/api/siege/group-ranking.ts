// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { SiegeRepository } from "src/repository/SiegeRepository";
import { PhaseRepository } from "src/repository/PhaseRepository";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";

type Data = {
    group?: number[];
    damage?: number[];
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

        let groupRanking = [[1,0],[2,0],[3,0],[4,0],[5,0],
                        [6,0],[7,0],[8,0],[9,0],[10,0],
                        [11,0],[12,0],[13,0],[14,0],[15,0],]

        for (let i = 0; i < siegeRanking.length; i++) {
            const siege = await siegeRepository.findOne(siegeRanking[i].id, {
                relations: ["player", "player.location", "player.group"],
            });
            if (siege === undefined) {
                throw new Error("no siege");
            }
            if (siege.player.group.num === 0) {
                continue
            }
            groupRanking[siege.player.group.num-1][1]+=siege.damage
        }

        groupRanking.sort((a,b)=>b[1]-a[1])

        return res.status(200).json({
            group: [groupRanking[0][0],groupRanking[1][0],groupRanking[2][0]],
            damage: [groupRanking[0][1],groupRanking[1][1],groupRanking[2][1]]
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
