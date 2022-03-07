// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { Cell, CELL_LEVEL_RESTRICT_AMOUNT } from 'src/entity/Cell'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import Joi from "joi"
import { CellRepository } from 'src/repository/CellRepository'
import { PlayerRepository } from 'src/repository/PlayerRepository'

type Data = {
    movedTo?: Cell,
    message?: string
}

const schema = Joi.object({
    teleportableToId: Joi.number()
        .integer()
        .required()
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    const token = req.cookies['token']
    const validateRes = schema.validate(req.body)
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message
        })
    }

    const { teleportableToId } : { teleportableToId: number } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    const cellRepository = getCustomRepository(CellRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOneByStudentId(
            studentId, [
                "player", "player.location", "player.location.region",
            ]
        )

        let moveTo = await cellRepository.findOneById(teleportableToId)
        if (!moveTo.isEnding) {
            if (!moveTo.isTeleportable) {
                throw new Error("텔레포트가 불가능한 셀입니다.")
            }
            
            if (user.player.level + CELL_LEVEL_RESTRICT_AMOUNT < moveTo.level) {
                throw new Error("레벨이 낮아 해당 셀로 갈 수 없습니다.")
            }
        }

        let updateResult = await playerRepository.updateLocation(user.player, user.player.location, moveTo)
        
        const newUserWithLocation = await userRepository.findOneByStudentId(
            studentId, [
            "player", "player.location", "player.location.region",
            "player.location.adjEast", "player.location.adjWest", "player.location.adjSouth", "player.location.adjNorth",
        ])

        return res.status(200).json({
            movedTo: newUserWithLocation.player.location
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