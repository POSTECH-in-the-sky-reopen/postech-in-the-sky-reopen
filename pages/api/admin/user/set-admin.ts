// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"

type Data = {
  message?: string
}

const schema = Joi.object({
    studentId: Joi.number()
        .integer()
        .required(),
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
    const { studentId } : { studentId: number } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        const user = await userRepository.findOneByStudentId(studentId)
        user.isAdmin = true
        await user.save()
        return res.status(200).json({
        })
    } catch (err) {
        return res.status(404).json({
            message: '존재하지 않는 사용자입니다.'
        })
    }
}
