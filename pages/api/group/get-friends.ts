// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import Joi from "joi";
import {
    ItemRepository,
    WeaponEquipableItemRepository,
} from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { ItemType } from "src/enums/ItemType";
import { readToken } from "src/lib/jwt";
import { UserRepository } from "src/repository/UserRepository";
import { EnchantItemInfo } from "src/entity/ItemInfo";
import { WeaponEquipableItem } from "src/entity/Item";
import { EnchantItemInfoRepository } from "src/repository/ItemInfoRepository";
import { CellRepository } from "src/repository/CellRepository";
import { Cell } from "src/entity/Cell";
import { Equipments } from "src/interfaces/Equipments";
import { Friend, getFriendDate } from "src/interfaces/Friend";
import { getEquipments } from "pages/api/player/equipments/get";
import { selectHonored } from "pages/api/player/achievement/select";

type Data = {
    friends?: Friend[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies["token"];
    await prepareConnection();
    const userRepository = getCustomRepository(UserRepository);
    const playerRepository = getCustomRepository(PlayerRepository);
    const cellRepository = getCustomRepository(CellRepository);
    try {
        const payload = readToken(token);
        const studentId = payload.studentId;
        const user = await userRepository.findOne(
            {
                studentId: studentId,
            },
            { relations: ["player", "player.group", "player.honored"] }
        );
        if (user === undefined) {
            throw new Error("유저가 존재하지 않습니다.");
        }
        if (user.player === null) {
            throw new Error("플레이어가 존재하지 않습니다.");
        }
        const players = await playerRepository.getPlayersByGroupInfo(
            user.player.group
        );
        let friends = [];
        for (let player of players) {
            friends.push({
                name: user.name,
                honored: selectHonored(player.honored.names,player.honored.honoredInd),
                equipments: await getEquipments(player.id),
                location: player.location,
                recentAccessedAt: getFriendDate(player.updatedAt),
            });
        }
        return res.status(200).json({ friends: friends });
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
