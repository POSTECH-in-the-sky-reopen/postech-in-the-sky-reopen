// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { Cell, CardinalDirection, CELL_LEVEL_RESTRICT_AMOUNT } from 'src/entity/Cell'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import Joi from "joi"
import { PlayerRepository } from 'src/repository/PlayerRepository'

type Data = {
    movedTo?: Cell,
    message?: string
}

const schema = Joi.object({
    cardinalDirection: Joi.number()
        .integer()
        .min(0)
        .max(3)
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

    const { cardinalDirection } : { cardinalDirection: CardinalDirection } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        const user = await userRepository.findOneByStudentIdSigned(
            studentId, [
                "player", "player.location", "player.location.region",
                "player.location.adjEast", "player.location.adjWest", "player.location.adjSouth", "player.location.adjNorth"
            ]
        )
        const cell = user.player.location
        let moveTo: Cell | null = null
        switch (cardinalDirection) {
            case CardinalDirection.East:
                moveTo = cell.adjEast
                break
            case CardinalDirection.West:
                moveTo = cell.adjWest
                break
            case CardinalDirection.South:
                moveTo = cell.adjSouth
                break
            case CardinalDirection.North:
                moveTo = cell.adjNorth
                break
        }

        if (moveTo === null) {
            throw new Error("????????? ???????????? ???????????????.")
        }

        if (user.player.level + CELL_LEVEL_RESTRICT_AMOUNT < moveTo.level) {
            throw new Error("????????? ?????? ?????? ?????? ??? ??? ????????????.")
        }

        let updateResult = await playerRepository.updateLocation(user.player, cell, moveTo)

        const newUserWithLocation = await userRepository.findOneByStudentIdSigned(
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
                message: '??? ??? ?????? ????????? ??????????????????.'
            })
        }
    }
}