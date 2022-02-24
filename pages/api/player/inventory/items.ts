// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository, getRepository } from "typeorm";
import { EquipableItemRepository, ItemRepository } from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { AccessoryEquipableItem, Item, WeaponEquipableItem } from "src/entity/Item";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";
import { Inventory } from "@mui/icons-material";
import Joi from "joi";
import { SortType } from "src/enums/SortType";
import { ItemType } from "src/enums/ItemType";

type Data = {
    items?: Item[];
    message?: string;
};

const schema = Joi.object({
    sortType: Joi.number(),
    sortDir: Joi.string(),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body, { allowUnknown: true });
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message,
        });
    }
    let {
        sortType,
        sortDir,
    }: { sortType: SortType | undefined; sortDir: "ASC" | "DESC" | undefined } =
        req.body;
    await prepareConnection();
    const itemRepository = getCustomRepository(ItemRepository);
    const equipableItemRepository = getCustomRepository(EquipableItemRepository);
    const weaponEquipableItemRepository = getRepository(WeaponEquipableItem);
    const accessoryEquipableItemRepository = getRepository(AccessoryEquipableItem);
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
            { relations: ["player"] }
        );
        if (user === undefined) {
            throw new Error("해당하는 유저가 없습니다.");
        }
        if (user.player === null) {
            throw new Error("플레이어가 없습니다.");
        }
        if (sortType === undefined) {
            sortType = SortType.EARN;
        }
        if (sortDir === undefined) {
            sortDir = "DESC";
        }
        let orderColumn1 = "item.id";
        let orderColumn2 = "level";
        let orderColumn3 = "battleType";
        let orderDir: "ASC" | "DESC" | undefined = sortDir;

        switch (sortType) {
            case SortType.EARN:
                orderColumn1 = "item.id";
                orderColumn2 = "level";
                orderColumn3 = "battleType";
                break;
            case SortType.BATTLETYPE:
                orderColumn1 = "battleType";
                orderColumn2 = "level";
                orderColumn3 = "sharpness";
                break;
            case SortType.LEVEL:
                orderColumn1 = "level";
                orderColumn2 = "sharpness";
                orderColumn3 = "battleType";
                break;
            default:
                break;
        }

        const items = await itemRepository
            .createQueryBuilder("item")
            .where({
                player: user.player
            })
            .andWhere("IFNULL(item.durability, 1) > 0")
            .leftJoinAndSelect("item.itemInfo", "itemInfo")
            .orderBy(orderColumn1, orderDir)
            .addOrderBy(orderColumn2, orderDir)
            .addOrderBy(orderColumn3, orderDir)
            .getMany();

        if (items.filter(item => item.itemType === ItemType.WEAPON).length === 0) {
            let defaultWeapon = await weaponEquipableItemRepository.find({ level: 0 })
            defaultWeapon.forEach(weapon => equipableItemRepository.repair(weapon.id))
        }
        if (items.filter(item => item.itemType === ItemType.ACCESSORY).length === 0) {
            let defaultAccessory = await accessoryEquipableItemRepository.find({ level: 0 })
            defaultAccessory.forEach(accessory => equipableItemRepository.repair(accessory.id))
        }

        return res.status(200).json({
            items: items,
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
