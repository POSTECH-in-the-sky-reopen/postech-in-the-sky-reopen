// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { createToken } from "src/lib/jwt"
import Cookies from "cookies"

type Data = {
    message?: string
}

const schema = Joi.object({
    studentId: Joi.number()
        .min(10000000)
        .max(99999999)
        .required(),
    password: Joi.string()
        .min(6)
        .required()
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
    const { studentId, password } : { studentId: number, password: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        const user = await userRepository.checkPassword(studentId, password)
        const token = createToken({
            studentId: user.studentId,
            isAdmin: user.isAdmin
        })
        const cookies = new Cookies(req, res)
        cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'strict',
        })
        return res.status(200).json({})
    } catch (err) {
        return res.status(404).json({
            message: '비밀번호가 틀렸거나 존재하지 않는 사용자입니다.'
        })
    }
}
