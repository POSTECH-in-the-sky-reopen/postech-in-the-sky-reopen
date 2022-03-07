// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { getCustomRepository } from "typeorm";
import { CellRepository } from "src/repository/CellRepository";
import { Cell } from "src/entity/Cell";
import { UserRepository } from "src/repository/UserRepository";
import { readToken } from "src/lib/jwt";

type Data = {
    cells?: Cell[];
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']

    await prepareConnection();
    const userRepository = getCustomRepository(UserRepository)
    const cellRepository = getCustomRepository(CellRepository);
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({
            studentId: studentId
        }, { relations: ["player"] })
        if (user === undefined) {
            throw new Error("유저가 존재하지 않습니다.")
        }
        if (user.player == null) {
            throw new Error("플레이어가 존재하지 않습니다.")
        }
        const cells = await cellRepository.getVisitableCells(user.player.level)
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
