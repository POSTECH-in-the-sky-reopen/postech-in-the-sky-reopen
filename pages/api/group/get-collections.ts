// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { readToken } from "src/lib/jwt";
import { UserRepository } from "src/repository/UserRepository";
import { ItemInfoRepository } from "src/repository/ItemInfoRepository";
import { CellRepository } from "src/repository/CellRepository";
import { getEffect, getEffectDetail } from "src/util/EffectList";
import { deepCopy } from "src/util/DeepCopy";
import { ItemCollectionRepository } from "src/repository/ItemCollectionRepository";
import { CoordiItemInfo } from "src/entity/ItemInfo";
import { getMark } from "src/util/Mark";
import { ItemType, Layer } from "src/enums/ItemType";


export interface ItemInfoForPlayer {
    name: string
    silhouetteId: string
    itemType: ItemType
    isFound: boolean
    layers: Layer[]
}

export interface CollectionForPlayer {
    collectionName: string;
    itemInfos: ItemInfoForPlayer[];
    effectDetail: string;
}


type Data = {
    collections?: CollectionForPlayer[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies["token"];
    await prepareConnection();
    const userRepository = getCustomRepository(UserRepository);
    const itemCollectionRepository = getCustomRepository(
        ItemCollectionRepository
    );
    const itemInfoRepository = getCustomRepository(ItemInfoRepository);
    const playerRepository = getCustomRepository(PlayerRepository);
    const cellRepository = getCustomRepository(CellRepository);
    try {
        const payload = readToken(token);
        const studentId = payload.studentId;
        const user = await userRepository.findOne(
            {
                studentId: studentId,
            },
            {
                relations: [
                    "player",
                    "player.group",
                    "player.group.itemCollections",
                ],
            }
        );
        if (user === undefined) {
            throw new Error("유저가 존재하지 않습니다.");
        }
        if (user.player === null) {
            throw new Error("플레이어가 존재하지 않습니다.");
        }
        if (user.player.group.num > 15) {
            throw new Error("잘못된 분반입니다.");
        }

        let collectionsForPlayer: CollectionForPlayer[] = [];
        const collections = user.player.group.itemCollections;

        for (let _c = 0; _c < collections.length; _c++) {
            const collection = await itemCollectionRepository.findOne(
                collections[_c].id,
                { relations: ["itemInfos"] }
            );
            if (collection === undefined) {
                continue;
            }
            const mark = user.player.group.collectionMarks[_c]
            let itemInfos = []
            for(let i = 0; i < collection.itemInfos.length; i++){
                itemInfos.push(deepCopy({
                    name: getMark(mark, i) ? collection.itemInfos[i].name: '',
                    silhouetteId: collection.itemInfos[i].silhouetteId,
                    isFound: getMark(mark, i),
                    itemType: collection.itemInfos[i].itemType,
                    layers: (collection.itemInfos[i] as CoordiItemInfo).layers
                }))
            }
            collectionsForPlayer.push(
                deepCopy({
                    collectionName: collection.name,
                    itemInfos: itemInfos,
                    effectDetail: getEffectDetail(getEffect(collection.name)),
                })
            );
        }
        return res.status(200).json({ collections: collectionsForPlayer });
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
