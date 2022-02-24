// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { EquipableItemRepository, ItemRepository } from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { EquipableItem, Item } from "src/entity/Item";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";
import { Inventory } from "@mui/icons-material";
import Joi from "joi";
import { SortType } from "src/enums/SortType";
import { ACHIEVE, CLOUDTOWERFLOOR_ACHIEVE, ITEM_ACHIEVE, LEVEL_ACHIEVE, MONEYUSED_ACHIEVE, SOCI_ACHIEVE } from "src/entity/Honored";
import { EquipableItemInfo, ItemInfo } from "src/entity/ItemInfo";
import { BattleType, fullBattleType } from "src/enums/BattleType";
import { HonoredRepository } from "src/repository/HonoredRepository";
import { deepCopy } from "src/util/DeepCopy";

export interface AchievementForPlayer{
    name: string
    detail: string
    honored: string
}

export interface ProgressForPlayer{
    name: string
    current: number
    next: number
}

type Data = {
    achieveds?: AchievementForPlayer[]
    progress?: ProgressForPlayer[]
    message?: string;
};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    const itemEquipableRepository = getCustomRepository(EquipableItemRepository);
    const honoredRepository = getCustomRepository(HonoredRepository)
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
            { relations: ["player", "player.honored", "player.achievement"] }
        );
        if (user === undefined) {
            throw new Error("해당하는 유저가 없습니다.");
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.");
        }

        const honored = user.player.honored
        const achievement = user.player.achievement

        let achieveds: AchievementForPlayer[] = []
        let newHonoreds:string[] = []

        //console.log("level check start")

        // 레벨 업적
        for(let i = honored.level+1; i < LEVEL_ACHIEVE.length; i++){
            if(LEVEL_ACHIEVE[i][ACHIEVE.CONDITION]===0){
                continue
            }
            if(user.player.level >= LEVEL_ACHIEVE[i][ACHIEVE.CONDITION]){
                achieveds.push(deepCopy({
                    name: LEVEL_ACHIEVE[i][ACHIEVE.NAME],
                    detail: LEVEL_ACHIEVE[i][ACHIEVE.DETAIL],
                    honored: LEVEL_ACHIEVE[i][ACHIEVE.HONORED]
                } as AchievementForPlayer))
                newHonoreds.push(LEVEL_ACHIEVE[i][ACHIEVE.HONORED] as string)
                honored.level++
            }
            else{
                break
            }
        }

        //console.log("level check end")

        //console.log("honored saved")

        //console.log(ITEM_ACHIEVE)
        // 아이템 업적
        for(let battleType = 0; battleType < BattleType.NONE; battleType++){

            //console.log(fullBattleType(battleType) + " check start")

            let items = await itemEquipableRepository
                .createQueryBuilder("item")
                .where({
                    player: user.player
                })
                .andWhere("IFNULL(item.durability, 1) > 0")
                .leftJoinAndSelect("item.itemInfo", "itemInfo")
                .getMany()
            
            let itemInfos = items.filter(i=>(i.itemInfo as EquipableItemInfo).battleType === battleType)

            //console.log(itemInfos)

            for(let i:number = + honored.items[battleType] + 1; i < ITEM_ACHIEVE[battleType].length; i++){
                if(ITEM_ACHIEVE[battleType][i][ACHIEVE.CONDITION]===0){
                    continue
                }
                if(itemInfos.length >= ITEM_ACHIEVE[battleType][i][ACHIEVE.CONDITION]){
                    achieveds.push(deepCopy({
                        name: ITEM_ACHIEVE[battleType][i][ACHIEVE.NAME],
                        detail: ITEM_ACHIEVE[battleType][i][ACHIEVE.DETAIL],
                        honored: ITEM_ACHIEVE[battleType][i][ACHIEVE.HONORED]
                    } as AchievementForPlayer))
                    newHonoreds.push(ITEM_ACHIEVE[battleType][i][ACHIEVE.HONORED] as string)
                    honored.items[battleType]++
                }
                else{
                    break
                }
            }


            //console.log(fullBattleType(battleType) + " check end")

        }

        for(let i = honored.cloudTowerFloor + 1; i < CLOUDTOWERFLOOR_ACHIEVE.length; i++){
            if(CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.CONDITION]===0){
                continue
            }
            if(achievement.cloudTowerFloor >= CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.CONDITION]){
                achieveds.push(deepCopy({
                    name: CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.NAME],
                    detail: CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.DETAIL],
                    honored: CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.HONORED]
                } as AchievementForPlayer))
                newHonoreds.push(CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.HONORED] as string)
                honored.cloudTowerFloor++
            }
            else{
                break
            }
        }

        // 코디 소비 업적
        for(let i = honored.moneyUsed + 1; i < MONEYUSED_ACHIEVE.length; i++){
            if(MONEYUSED_ACHIEVE[i][ACHIEVE.CONDITION]===0){
                continue
            }
            if(achievement.moneyUsed >= MONEYUSED_ACHIEVE[i][ACHIEVE.CONDITION]){
                achieveds.push(deepCopy({
                    name: MONEYUSED_ACHIEVE[i][ACHIEVE.NAME],
                    detail: MONEYUSED_ACHIEVE[i][ACHIEVE.DETAIL],
                    honored: MONEYUSED_ACHIEVE[i][ACHIEVE.HONORED]
                } as AchievementForPlayer))
                newHonoreds.push(MONEYUSED_ACHIEVE[i][ACHIEVE.HONORED] as string)
                honored.moneyUsed++
            }
            else{
                break
            }
        }

        //console.log("coordi check end")

        await honored.save()

        //console.log("honored saved")

        // // 구름탑 업적
        // for(let i = honored.cloudTowerFloor + 1; i < CLOUDTOWERFLOOR_ACHIEVE.length; i++){
        //     if(achievement.cloudTowerFloor >= CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.CONDITION]){
        //         achieveds.push(deepCopy({
        //             name: CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.NAME],
        //             detail: CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.DETAIL],
        //             honored: CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.HONORED]
        //         } as AchievementForPlayer))
        //         newHonoreds.push(CLOUDTOWERFLOOR_ACHIEVE[i][ACHIEVE.HONORED] as string)
        //         honored.cloudTowerFloor++
        //     }
        //     else{
        //         break
        //     }
        // }

        await honoredRepository.updateNames(honored.id, honored.names.concat(newHonoreds))

        //console.log("honored update")

        
        //console.log(achievement)
        //console.log(honored)

        return res.status(200).json({
            achieveds: achieveds,
            //progress: progress
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
