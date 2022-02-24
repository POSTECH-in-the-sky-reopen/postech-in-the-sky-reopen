// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { Cell } from 'src/entity/Cell'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import Joi from "joi"
import { RegionRepository } from 'src/repository/RegionRepository'

type Data = {
    cell?: Cell,
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOneByStudentId(
            studentId, [
            "player", "player.location", "player.location.region",
            "player.location.adjEast", "player.location.adjWest", "player.location.adjSouth", "player.location.adjNorth",
        ]
        )
        return res.status(200).json({
            cell: user.player.location
        })
    } catch (err) {
        return res.status(400).json({
            message: '현재 위치를 찾지 못했습니다.'
        })
    }
}


export async function getRegion(studentId: number) {
    const userRepository = getCustomRepository(UserRepository)
    const user = await userRepository.findOneByStudentId(
        studentId, [
        "player", "player.location", "player.location.region",
    ]
    )
    return user.player.location.region
}
