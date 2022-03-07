// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'

type Data = {
    fatigue?: number,
    message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    const token = req.cookies['token']

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        let user = await userRepository.findOneByStudentId(studentId, ["player"])
        const updateResult = await playerRepository.updateFatigue(user.player.id)
        await user.player.reload()
        return res.status(200).json({
            fatigue: user.player.fatigue
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: '피로도를 가져오던 중 에러가 발생했습니다.'
        })
    }
}