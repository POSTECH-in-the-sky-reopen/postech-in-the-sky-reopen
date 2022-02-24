// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getEquipments } from "pages/api/player/equipments/get";
import { getEquipedInformation } from "pages/api/player/status/check";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { UserRepository } from "src/repository/UserRepository";
import { getCustomRepository } from "typeorm";
import prepareConnection from "src/lib/db";

interface BlackTigerPlayer{
    studentId: number
    statusSum: number
}

type Data = {
    players?: BlackTigerPlayer[]
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    try {
        const playerRepository = getCustomRepository(PlayerRepository)
        const userRepository = getCustomRepository(UserRepository)
        const users = await userRepository.find({relations:["player"]})
        let blacktiger = []
        for(let user of users){
            const equipments = await getEquipments(user.player.id)
            const equipedInfo = getEquipedInformation(equipments)
            const status = equipedInfo.status
            blacktiger.push({
                studentId: user.studentId,
                statusSum: status.attack + status.defense + status.hpmax + status.luck 
            } as BlackTigerPlayer)
        }   

        return res.status(200).json({
            players: blacktiger
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
