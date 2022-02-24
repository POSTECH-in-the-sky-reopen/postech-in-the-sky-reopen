// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { BattleType } from 'src/enums/BattleType'
import { Status } from 'src/interfaces/Status'
import { BossMonsterInfoRepository } from 'src/repository/MonsterInfoRepository'
import { BossMonsterInfo, MAX_MONSTERINFO_NAME_LENGTH } from 'src/entity/MonsterInfo'

type Data = {
    bossMonsterInfo?: BossMonsterInfo
    message?: string
}

const schema = Joi.object({
    // 보스 몬스터 정보에는 이름, 속성, 능력치를 명시한다
    name: Joi.string()
        .max(MAX_MONSTERINFO_NAME_LENGTH)
        .required(),
    battleType: Joi.number()
        .required(),
    status: Joi.object({
        attack: Joi.number()
            .required(),
        defense: Joi.number()
            .required(),
        hpmax: Joi.number()
            .required(),
        luck: Joi.number()
            .required(),
    }).required(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message
        })
    }
    const { name, battleType, status }: { name: string, battleType: BattleType, status: Status } = req.body

    await prepareConnection()
    try {
        const bossMonsterInfoRepository = getCustomRepository(BossMonsterInfoRepository)
        await bossMonsterInfoRepository.assureNonexistByName(name)
        const bossMonsterInfo = await bossMonsterInfoRepository.createAndSave(name, battleType, status)
        return res.status(201).json({ bossMonsterInfo: bossMonsterInfo })
    } catch (err) {
        return res.status(409).json({
            message: '같은 이름을 가진 보스 몬스터가 이미 존재합니다.'
        })
    }
}
