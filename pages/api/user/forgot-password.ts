// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import sendMail from 'src/lib/mail'

type Data = {
    email?: string,
    message?: string
}

const schema = Joi.object({
    name: Joi.string()
        .required(),
    studentId: Joi.number()
        .required(),
    povisId: Joi.string()
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
    const { name, studentId, povisId } : { name: string, studentId: number, povisId: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        const user = await userRepository.findOneByInfo(name, studentId, povisId)
        const filterRegExp = new RegExp("(.{0,3})(.*)", "g")
        const matches = user.povisId.matchAll(filterRegExp)
        const match = matches.next().value
        if (match === undefined) {
            throw new Error('invalid email')
        }
        const filtered = match[1] + '*'.repeat(match[2].length) + '@postech.ac.kr'

        const resetPasswordToken = await userRepository.generateResetPasswordToken(user.id)
        const resetUrl = `http://${req.headers.host}/user/reset-password?resetPasswordToken=${resetPasswordToken}`

        const from = '<천공의 섬 포스텍>'
        const email = `${user.povisId}@postech.ac.kr`
        const subject = '비밀번호 재설정 안내'
        const content = '안녕하세요 학우님! <천공의 섬 포스텍>입니다.<br><br>'
                        + '본 메일은 학우님의 비밀번호를 재설정하기 위해 발송되었습니다. '
                        + '이 메일을 받으셨더라도 아래 링크로 접속하지 않으시면 비밀번호는 변경되지 않습니다.<br><br>'
                        + `<a href=${resetUrl}>비밀번호 재설정하기</a><br><br>`
                        + '위 버튼이 눌리지 않는다면 아래 주소로 접속해주세요.<br>'
                        + resetUrl
        await sendMail(from, email, subject, content)

        return res.status(200).json({
            email: filtered
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: "알 수 없는 오류가 발생했습니다.",
            });
        }
    }
}
