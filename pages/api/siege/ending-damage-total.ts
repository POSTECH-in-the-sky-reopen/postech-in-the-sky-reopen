// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { SiegeRepository } from 'src/repository/SiegeRepository'
import { PhaseRepository } from 'src/repository/PhaseRepository'
import { readToken } from 'src/lib/jwt'
import { UserRepository } from 'src/repository/UserRepository'


type Data = {
    totalDamage? : number
    message?: string
}

const schema = Joi.object({
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
    
    let { phase }: { phase: number|undefined } = req.body;
    const token = req.cookies["token"];
    const payload = readToken(token);
    await prepareConnection()
    try {
        const userRepository = getCustomRepository(UserRepository);
        const phaseRepository = getCustomRepository(PhaseRepository)
        const siegeRepository = getCustomRepository(SiegeRepository)
        const studentId = payload.studentId;
        const user = await userRepository.findOne(
            {
                studentId: studentId,
            },
            { relations: ["player", "player.location"] }
        );
        if (user === undefined) {
            throw new Error("해당 학번에 해당하는 유저가 없습니다.");
        }
        if (!user.player.location.isEnding) {
            throw new Error("엔딩 셀이 아닙니다.")
        }
        if (phase === undefined) {
            phase = (await phaseRepository.find())[0].phase;
        }
        const { sum } = await siegeRepository
            .createQueryBuilder("siege")
            .leftJoin('siege.cell', 'cell')
            .leftJoin('siege.player', 'player')
            .leftJoinAndSelect('player.group', 'group')
            .select("SUM(damage)", "sum")
            .where("phase = :phase", {phase: phase})
            .andWhere("cell.isEnding = 1")
            .andWhere("group.num > 0")
            .getRawOne()
        return res.status(200).json({
            totalDamage: sum
        })
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
