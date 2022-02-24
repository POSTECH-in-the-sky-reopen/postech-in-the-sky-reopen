// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository, getRepository } from "typeorm"
import Joi from "joi"
import { UserRepository } from 'src/repository/UserRepository'
import { readToken } from 'src/lib/jwt'
import { BossMonsterInfo, MonsterInfo } from 'src/entity/MonsterInfo'
import { BattleType } from 'src/enums/BattleType'

interface SimpleMonsterInfo {
    encountered: boolean,
    name?: string,
    battleType: BattleType,
    silhouetteId: string,
}

type Data = {
    monsters?: SimpleMonsterInfo[],
    message?: string
}

// no req

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const monsterInfoRepository = getRepository(MonsterInfo)
    const bossMonsterInfoRepository = getRepository(BossMonsterInfo)
    const token = req.cookies['token']
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOne({ studentId: studentId }, { relations: ["player", "player.encounteredMonsters", "player.encounteredBossMonsters"] })

        if (user === undefined) {
            return res.status(404).json({
                message: "해당 학번에 해당하는 유저가 없습니다."
            })
        }

        let monsters = await monsterInfoRepository.find({
            order: {
                battleType: "ASC"
            }
        })
        let encounteredMonsters = user.player.encounteredMonsters.map(monster => monster.id)
        let retMonsters: SimpleMonsterInfo[] = []
        for (let monsterInfo of monsters) {
            let simpleMonsterInfo: SimpleMonsterInfo = {
                encountered: encounteredMonsters.includes(monsterInfo.id),
                silhouetteId: monsterInfo.silhouetteId,
                battleType: monsterInfo.battleType,
            }
            if (simpleMonsterInfo.encountered) {
                simpleMonsterInfo.name = monsterInfo.name
            }
            retMonsters.push(simpleMonsterInfo)
        }

        let bossMonsters = await bossMonsterInfoRepository.find({
            order: {
                battleType: "ASC"
            }
        })
        let encounteredBossMonsters = user.player.encounteredBossMonsters.map(monster => monster.id)
        for (let bossMonsterInfo of bossMonsters) {
            let simpleMonsterInfo: SimpleMonsterInfo = {
                encountered: encounteredBossMonsters.includes(bossMonsterInfo.id),
                silhouetteId: bossMonsterInfo.silhouetteId,
                battleType: bossMonsterInfo.battleType,
            }
            if (simpleMonsterInfo.encountered) {
                simpleMonsterInfo.name = bossMonsterInfo.name
            }
            retMonsters.push(simpleMonsterInfo)
        }

        return res.status(200).json({
            monsters: retMonsters
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