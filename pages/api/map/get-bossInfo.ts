// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import { BattleType } from 'src/enums/BattleType'
import { BossMonsterInfoRepository } from 'src/repository/MonsterInfoRepository'
import { BossMonsterInfo } from 'src/entity/MonsterInfo'

type Data = {
    bossMonsterInfo?: BossMonsterInfo
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const bossMonsterInfoRepository = getCustomRepository(BossMonsterInfoRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        let user = await userRepository.findOneByStudentIdSigned(studentId, ["player", "player.location"])

        if (!user.player.location.isCapturable) {
            throw new Error("점령전 셀이 아닙니다.")
        }

        if (user.player.location.battleType === BattleType.NONE) {
            throw new Error("탐색이 불가능한 셀입니다.")
        }
        // 지역 레벨 기반으로 몬스터 세부 능력치와 인챈트 여부 결정
        const bossInfo = await bossMonsterInfoRepository.getOne(user.player.location.battleType)
        
        return res.status(200).json({
            bossMonsterInfo: bossInfo
        })


    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            console.error(err)
            return res.status(500).json({
                message: '알 수 없는 오류가 발생했습니다.'
            })
        }
    }
}