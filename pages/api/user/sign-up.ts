// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { NANOID_LENGTH } from 'src/entity/User'

type Data = {
    studentId?: number,
    name?: string,
    message?: string
}

const schema = Joi.object({
    pin: Joi.string()
        .length(NANOID_LENGTH)
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2})
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
    const { pin, password, email } : { pin: string, password: string, email: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        const user = await userRepository.findOneByPinRegister(pin)
        let updateResult = await userRepository.updatePassword(user.id, password)
        updateResult = await userRepository.updateEmail(user.id, email)
        return res.status(201).json({
            studentId: user.studentId,
            name: user.name
        })
    } catch (err) {
        return res.status(400).json({
            message: '잘못된 요청입니다.'
        })
    }
}