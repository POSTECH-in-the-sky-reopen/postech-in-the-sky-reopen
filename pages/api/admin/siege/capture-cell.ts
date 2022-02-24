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

type Data = {
    message?: string;
};

const schema = Joi.object({
    cellName: Joi.string().required(),
    groupNum: Joi.number().required(),
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
    let { cellName, groupNum }: { cellName: string; groupNum: number } =
        req.body;
    await prepareConnection();
    try {
        const cellRepository = getCustomRepository(CellRepository);
        const groupRepository = getCustomRepository(GroupInfoRepository);
        const cell = await cellRepository.findOne({
            where: { name: cellName },
        });
        if (cell === undefined) {
            throw new Error("no cell");
        }
        if (!cell.isCapturable) {
            throw new Error("not capturable");
        }
        const group = await groupRepository.findOne({
            where: { num: groupNum },
        });
        if (group === undefined) {
            throw new Error("no group");
        }
        await cellRepository.updateGroup(cell.id, group);
        return res.status(200).json({});
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
