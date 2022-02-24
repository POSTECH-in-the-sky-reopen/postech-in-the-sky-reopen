// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { NANOID_LENGTH } from 'src/entity/User'

type Data = {
}

const schema = Joi.object({
    resetPasswordToken: Joi.string()
        .length(NANOID_LENGTH)
        .required(),
    password: Joi.string()
        .min(6)
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
    const { resetPasswordToken, password } : { resetPasswordToken: string, password: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        let updateResult = await userRepository.updatePasswordByResetPasswordToken(password, resetPasswordToken)
        if (updateResult.affected === 0) {
            throw new Error('만료된 비밀번호 재설정 요청입니다.')
        }
        return res.status(200).json({
        })
    } catch (err) {
        return res.status(404).json({
            message: (err as Error).message
        })
    }
}
