// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import Joi from "joi";
import { SiegeRepository } from "src/repository/SiegeRepository";
import { PhaseRepository } from "src/repository/PhaseRepository";
import { CellRepository } from "src/repository/CellRepository";
import { deepCopy } from "src/util/DeepCopy";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";

export interface Hash {
    [details: number]: number;
}

export interface DHash {
    [details: number]: Hash;
}

type Data = {
    cellOccupation?: number;
    cellGroupInfoDamage?: Hash;
    message?: string;
};

const schema = Joi.object({
    cellId: Joi.number().required(),
    phase: Joi.number()
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
    let { cellId, phase }: { cellId: number, phase: number|undefined } = req.body;
    await prepareConnection();
    try {
        const phaseRepository = getCustomRepository(PhaseRepository);
        const siegeRepository = getCustomRepository(SiegeRepository);
        const cellRepository = getCustomRepository(CellRepository);
        const groupRepository = getCustomRepository(GroupInfoRepository)
        const cell = await cellRepository.findOne(cellId);
        if (cell === undefined) {
            throw new Error("no cell");
        }
        if (!cell.isCapturable) {
            throw new Error("not capturable");
        }
        if (phase === undefined) {
            phase = (await phaseRepository.find())[0].phase;
        }
        const sieges = await siegeRepository.find({
            where: {
                phase: phase,
                cell: cell,
            },
            relations: ["player", "player.group"],
        });
        let cellGroupInfoDamage: Hash = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
        };
        for (let i = 0; i < sieges.length; i++) {
            const siege = sieges[i];
            cellGroupInfoDamage[siege.player.group.num] += siege.damage;
        }
        let maxDamageGroupInfo = 0;
        let maxDamage = 0;
        for (let j = 1; j < 16; j++) {
            if (maxDamage < cellGroupInfoDamage[j]) {
                maxDamage = cellGroupInfoDamage[j];
                maxDamageGroupInfo = j;
            }
        }
        const group = await groupRepository.findOne({where: {num: maxDamageGroupInfo}})
        if(group === undefined){
            throw new Error("no group")
        }
        await cellRepository.updateGroup(cell.id, group);
        return res.status(201).json({
            cellOccupation: maxDamageGroupInfo,
            cellGroupInfoDamage: cellGroupInfoDamage,
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
