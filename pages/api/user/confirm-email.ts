// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { NANOID_LENGTH } from 'src/entity/User'

type Data = {
    message?: string
}

const schema = Joi.object({
    confirmEmailToken: Joi.string()
        .length(NANOID_LENGTH)
        .required(),
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
    const { confirmEmailToken } : { confirmEmailToken: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        let updateResult = await userRepository.confirmEmail(confirmEmailToken)
        if (updateResult.affected === 0) {
            throw new Error('존재하지 않는 사용자입니다.')
        }
        return res.status(200).json({
        })
    } catch (err) {
        return res.status(404).json({
            message: (err as Error).message
        })
    }
}
