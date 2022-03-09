// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { UserRepository } from "src/repository/UserRepository";
import { getCustomRepository } from "typeorm";
import { readToken } from "src/lib/jwt";
import Joi from "joi";
import {
    CoordiItemRepository,
    ItemRepository,
} from "src/repository/ItemRepository";
import { CoordiItemInfoRepository } from "src/repository/ItemInfoRepository";
import { ItemType } from "src/enums/ItemType";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { COORDI_GACHA_COST } from "src/constants/shopCost";
import { ItemInfo } from "src/entity/ItemInfo";
import { AchievementRepository } from "src/repository/AchievementRepository";
import { addItemManage } from "src/util/ItemManagement";

type Data = {
    gachaItemInfo?: ItemInfo;
    doubleCheck?: boolean;
    moneyUsed?: number;
    itemCollection?: string
    message?: string;
};

const schema = Joi.object({
    coordiType: Joi.number().required(),
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

    const token = req.cookies["token"];
    const { coordiType }: { coordiType: ItemType } = req.body;
    await prepareConnection();
    const itemRepository = getCustomRepository(ItemRepository);
    const coordiItemRepository = getCustomRepository(CoordiItemRepository);
    const userRepository = getCustomRepository(UserRepository);
    const coordiItemInfoRepository = getCustomRepository(
        CoordiItemInfoRepository
    );
    const playerRepository = getCustomRepository(PlayerRepository);
    const achievementRepository = getCustomRepository(AchievementRepository)
    try {
        const payload = readToken(token);
        const studentId = payload.studentId;
        let user = await userRepository.findOneByStudentIdSigned(studentId, [
            "player",
            "player.achievement",
            "player.group"
        ]);
        let player = await playerRepository.findOne(user.player.id);
        if (
            coordiType !== ItemType.FACE &&
            coordiType !== ItemType.HAIR &&
            coordiType !== ItemType.SUIT &&
            coordiType !== ItemType.DECO
        ) {
            throw new Error("잘못된 아이템 타입입니다.");
        }
        if (player == undefined) {
            throw new Error("플레이어 정보가 없습니다.");
        }
        const coordiCount = (await itemRepository.getCoordiItems(player)).length
        const cost = ((COORDI_GACHA_COST + 5 * coordiCount) * (100 - user.player.group.coordiCost) / 100)
        if (player.money < cost) {
            throw new Error("돈이 부족합니다.");
        }
        await playerRepository.useMoney(user.player.id, cost);
        const coordiItemInfo = await coordiItemInfoRepository
            .createQueryBuilder()
            .where("itemType = :type", { type: coordiType })
            .orderBy("RAND()")
            .getOneOrFail();
        const coordiItemExist = await coordiItemRepository.findOne({
            itemInfo: coordiItemInfo,
            player: player
        })

        // 업적용 정보 갱신
        await achievementRepository.updateWholeGachaMoney(user.player.achievement.id, cost)

        if(coordiItemExist === undefined){
            const coordiItem = await coordiItemRepository.createAndSave(
                coordiItemInfo
            );
            const itemCollections = await addItemManage(user.player, coordiItem)
            return res.status(200).json({
                gachaItemInfo: coordiItemInfo,
                doubleCheck: false,
                itemCollection: itemCollections[0],
                moneyUsed: cost,
            });
        }
        return res.status(200).json({
            gachaItemInfo: coordiItemInfo,
            doubleCheck: true,
            moneyUsed: cost,
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