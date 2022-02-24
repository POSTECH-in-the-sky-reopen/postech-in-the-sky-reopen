// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { Player } from 'src/entity/Player'
import { generatePlayer } from 'pages/api/player/generate'
import { createPin } from 'src/util/Pin'

type Data = {
  pin?: string,
  playerId?: number,
  message?: string
}

const schema = Joi.object({
    name: Joi.string()
        .max(20)
        .required(),
    studentId: Joi.number()
        .integer()
        .min(20000000),
    isAdmin: Joi.boolean()
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
    const { name, studentId, isAdmin } : { name: string, studentId: number, isAdmin: boolean|undefined } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        await userRepository.assureNonexistByStudentId(studentId)
        let pin: string
        while (true) {
            try {
                pin = createPin()
                await userRepository.assureNonexistByPin(pin)
                break
            } catch (err) {
                continue
            }
        }
        const user = await userRepository.createAndSave(pin, name, studentId, isAdmin)
        let player: Player | undefined = undefined
        try {
            player = await generatePlayer(user.id, user.name)
        } catch (err) {
            return res.status(500).json({
                message: "플레이어 생성에 실패하였습니다."
            })
        }
        return res.status(201).json({
            pin: user.pin,
            playerId: player.id,
        })
    } catch (err) {
        return res.status(409).json({
            message: '같은 학번을 가진 사용자가 이미 존재합니다.'
        })
    }
}
