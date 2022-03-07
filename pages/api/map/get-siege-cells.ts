// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { CellRepository } from "src/repository/CellRepository";
import { Cell } from "src/entity/Cell";

type Data = {
    cells?: Cell[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    const cellRepository = getCustomRepository(CellRepository);
    try {
        const cells = await cellRepository.getSiegeCells()
        return res.status(200).json({
            cells: cells,
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
