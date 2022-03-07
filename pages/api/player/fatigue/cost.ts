// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import { FATIGUE_REFRESH_MONEY } from 'src/entity/Player'
import { AVG_CELL_PER_REGION } from 'src/entity/Cell'

type Data = {
    cost?: number,
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
        let user = await userRepository.findOneByStudentId(studentId, ["player"])
        return res.status(200).json({
            cost: Math.floor(user.player.level / AVG_CELL_PER_REGION) * FATIGUE_REFRESH_MONEY
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            message: '피로도 회복 비용을 가져오던 중 에러가 발생했습니다.'
        })
    }
}