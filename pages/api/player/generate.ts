// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { CellRepository } from 'src/repository/CellRepository'
import { DEFAULT_CELL_LOCATION } from 'src/entity/Cell'
import { Player } from 'src/entity/Player'
import { AchievementRepository } from 'src/repository/AchievementRepository'
import { Honored } from 'src/entity/Honored'
import { HonoredRepository } from 'src/repository/HonoredRepository'

type Data = {
    hasPlayer: boolean,
    message?: string
}

// no req

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const token = req.cookies['token']

    const payload = readToken(token)
    const studentId = payload.studentId
    const user = await userRepository.findOne({ studentId: studentId }, { relations: ["player"] })

    if (user === undefined) {
        return res.status(404).json({
            hasPlayer: false,
            message: "해당 학번에 해당하는 유저가 없습니다."
        })
    }
    if (user.player !== null) {
        return res.status(409).json({
            hasPlayer: true,
            message: "이미 유저는 플레이어를 가지고 있습니다."
        })
    }
    try {
        generatePlayer(user.id, user.name)
    } catch (err) {
        return res.status(500).json({
            hasPlayer: false,
            message: "플레이어 생성에 실패하였습니다."
        })
    }
    return res.status(201).json({
        hasPlayer: true,
        message: "플레이어를 생성했습니다."
    })

}

export async function generatePlayer(userId: number, name: string): Promise<Player> {
    return new Promise((resolve, reject) => {
        const userRepository = getCustomRepository(UserRepository)
        const playerRepository = getCustomRepository(PlayerRepository)
        const cellRepository = getCustomRepository(CellRepository)
        const achievementRepository = getCustomRepository(AchievementRepository)
        const honoredRepository = getCustomRepository(HonoredRepository)
        const promiseAchievement = achievementRepository.createAndSave()
        const promiseHonored = honoredRepository.createAndSave()
        const promiseDefaultCell = cellRepository.findOneById(DEFAULT_CELL_LOCATION)
        Promise.all([promiseAchievement, promiseHonored, promiseDefaultCell])
            .then(async ([achievement, honored, defaultCell]) => {
                const player = await playerRepository.createAndSave(name, achievement, honored, defaultCell)
                const updateRes = await userRepository.updatePlayer(userId, player)
                if (updateRes === undefined || updateRes.affected === 0) {
                    await playerRepository.delete(player.id)
                    return reject()
                }
                return resolve(player)
            })
    })
}
