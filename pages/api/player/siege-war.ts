// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { UserRepository } from "src/repository/UserRepository";
import { getCustomRepository } from "typeorm";
import { readToken } from "src/lib/jwt";
import {
    FATIGUE_INCREASE_AMOUNT,
    FATIGUE_LIMIT,
} from "src/entity/Player";
import { getEquipedInformation } from "./status/check";
import { getEquipments } from "./equipments/get";
import { Log } from "src/interfaces/Log";
import { EquipableItemRepository } from "src/repository/ItemRepository";
import { BattleType } from "src/enums/BattleType";
import { siegeWar } from "src/util/SiegeWar";
import { PhaseRepository } from "src/repository/PhaseRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { SiegeRepository } from "src/repository/SiegeRepository";
import { BossMonsterInfoRepository } from "src/repository/MonsterInfoRepository";
import { MONSTER_STRENGTH_MULTIPLIER_PER_LEVEL } from "src/entity/Region";
import { BossMonsterInfoData } from "src/entity/MonsterInfo";
import { EquipedInformation } from "src/interfaces/EquipedInformation";
import { EquipableItem, Item } from "src/entity/Item";
import { MAX_DURABILITY } from "src/constants/durability";
import { AchievementRepository } from "src/repository/AchievementRepository";
import { EnchantItemInfo } from "src/entity/ItemInfo";

type Data = {
    bossMonsterInfo?: BossMonsterInfoData;
    eventLog?: Log[];
    damage?: number;
    fatigueIncreased?: number;
    playerEquipedInfo?: EquipedInformation;
    brokenItems?: Item[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies["token"];

    await prepareConnection();
    const phaseRepository = getCustomRepository(PhaseRepository);
    const siegeRepository = getCustomRepository(SiegeRepository);
    const userRepository = getCustomRepository(UserRepository);
    const playerRepository = getCustomRepository(PlayerRepository);
    const bossMonsterInfoRepository = getCustomRepository(
        BossMonsterInfoRepository
    );
    const achievementRepository = getCustomRepository(AchievementRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        let user = await userRepository.findOneByStudentIdSigned(studentId, ["player", "player.group",  "player.inventory", "player.achievement", "player.location", "player.location.region", "player.encounteredBossMonsters"])

        if (!user.player.location.isCapturable) {
            throw new Error("???????????? ????????? ????????????.");
        }

        if (!user.player.location.ableToBattle) {
            throw new Error("?????? ?????? ???????????? ????????????.");
        }

        if (user.player.location.battleType === BattleType.NONE) {
            throw new Error("????????? ???????????? ????????????.");
        }

        if (user.player.fatigue > FATIGUE_LIMIT) {
            throw new Error(
                `???????????? ${FATIGUE_LIMIT}?????? ??????, ????????? ??? ????????????.`
            );
        }

        const equipments = await getEquipments(user.player.id)
        const equipedInfo = getEquipedInformation(equipments)
        if (equipments.Weapon === undefined || equipments.Accessory === undefined) {
            throw new Error("????????? ???????????? ?????? ???????????? ????????? ???????????????.")
        }

        // ?????? ?????? ?????? ?????? ?????? ??????
        if (
            (equipments.Weapon as EquipableItem).level >
                user.player.location.region.level ||
            (equipments.Accessory as EquipableItem).level >
                user.player.location.region.level
        ) {
            throw new Error("????????? ???????????? ????????? ?????? ???????????? ????????????.");
        }

        const phase = (await phaseRepository.findOneOrFail()).phase;
        // ????????? ????????? ?????? ?????? ????????? ??????

        // ?????? ?????? ???????????? ????????? ?????? ???????????? ????????? ?????? ??????
        const bossInfo = await bossMonsterInfoRepository.getOne(
            user.player.location.battleType
        );
        const boss = generateBoss(bossInfo, user.player.location.region.level);
        // ?????? ??????
        const [battleLog, turn, damage] = siegeWar(equipedInfo, boss);
        await siegeRepository.makeSiege(
            user.player.location,
            user.player,
            phase,
            damage
        );

        // ????????? ??????
        const equipableItemRepository = getCustomRepository(
            EquipableItemRepository
        );
        const promiseWeaponDec = equipableItemRepository.decreaseDurability(
            equipments.Weapon.id,
            MAX_DURABILITY - 1
        );
        const promiseAccessoryDec = equipableItemRepository.decreaseDurability(
            equipments.Accessory.id,
            MAX_DURABILITY - 1
        );
        await Promise.all([promiseWeaponDec, promiseAccessoryDec]);

        // ?????? ????????? 0 ????????? ?????? ?????? ??????
        let brokenItems = [];
        let weapon = await equipableItemRepository.findOne(
            equipments.Weapon.id
        );
        if (weapon !== undefined) {
            if (weapon.durability <= 0) {
                weapon.equiped = false;
                await weapon.save();
                brokenItems.push(weapon);
            }
        }

        let accessory = await equipableItemRepository.findOne(
            equipments.Accessory.id
        );
        if (accessory !== undefined) {
            if (accessory.durability <= 0) {
                accessory.equiped = false;
                await accessory.save();
                brokenItems.push(accessory);
            }
        }

        // ?????? ??????, ???????????? ?????? ??????
        const fatigueIncreased = FATIGUE_INCREASE_AMOUNT.lose
        await playerRepository.incFatigue(user.player.id, Math.max(fatigueIncreased - user.player.group.fatigueIncrease, 1))

        // ????????? ?????? ??????
        await achievementRepository.updateWholeBossDamage(user.player.achievement.id, damage)

        // ?????? ????????? ????????? ??????
        try {
            await playerRepository.addEncounteredBossMonster(user.player.id, bossInfo)
        } catch (err) {
            
        }

        return res.status(200).json({
            bossMonsterInfo: bossInfo,
            eventLog: battleLog,
            damage: damage,
            fatigueIncreased: fatigueIncreased,
            playerEquipedInfo: equipedInfo,
            brokenItems: brokenItems,
        });
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: "??? ??? ?????? ????????? ??????????????????.",
            });
        }
    }
}

export function generateBoss(
    bossMonsterInfo: BossMonsterInfoData,
    level: number,
    enchantItemInfo: EnchantItemInfo|undefined=undefined
): EquipedInformation {
    const mul = MONSTER_STRENGTH_MULTIPLIER_PER_LEVEL[level];
    return {
        status: {
            attack: mul * bossMonsterInfo.status.attack,
            defense: mul * bossMonsterInfo.status.defense,
            hpmax: mul * bossMonsterInfo.status.hpmax,
            luck: mul * bossMonsterInfo.status.luck,
        },
        attackBattleType: bossMonsterInfo.battleType,
        defenseBattleType: bossMonsterInfo.battleType,
        enchantItemInfo: enchantItemInfo,
    };
}
