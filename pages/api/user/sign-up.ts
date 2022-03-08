// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { Player } from 'src/entity/Player'
import { CellRepository } from 'src/repository/CellRepository'
import { AchievementRepository } from 'src/repository/AchievementRepository'
import { HonoredRepository } from 'src/repository/HonoredRepository'
import { DEFAULT_CELL_LOCATION } from 'src/entity/Cell'
import sendMail from 'src/lib/mail'

type Data = {
    email?: string,
    message?: string
}

const schema = Joi.object({
    name: Joi.string()
        .required(),
    studentId: Joi.number()
        .min(10000000)
        .required(),
    povisId: Joi.string()
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
    const { name, studentId, povisId, password } : { name: string, studentId: number, povisId: string, password: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        await userRepository.assureNonexistByInfo(name, studentId, povisId)
        const user = await userRepository.createAndSave(name, studentId, povisId, false, password)
        await generatePlayer(user.id, user.name)
        
        const filterRegExp = new RegExp("(.{0,3})(.*)", "g")
        const matches = povisId.matchAll(filterRegExp)
        const match = matches.next().value
        if (match === undefined) {
            throw new Error('invalid email')
        }
        const filtered = match[1] + '*'.repeat(match[2].length) + '@postech.ac.kr'

        const confirmEmailToken = await userRepository.generateResetPasswordToken(user.id)
        sendConfirmationEmail(req.headers.host, user.povisId, confirmEmailToken)
        return res.status(201).json({
            email: filtered,
            message: "유저를 생성했습니다."
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(404).json({
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

async function generatePlayer(userId: number, name: string): Promise<Player> {
    return new Promise((resolve, reject) => {
        const userRepository = getCustomRepository(UserRepository)
        const playerRepository = getCustomRepository(PlayerRepository)
        const cellRepository = getCustomRepository(CellRepository)
        const achievementRepository = getCustomRepository(AchievementRepository)
        const honoredRepository = getCustomRepository(HonoredRepository)
        const promiseAchievement = achievementRepository.createAndSave()
        const promiseHonored = honoredRepository.createAndSave()
        const promiseDefaultCell = cellRepository.findOneById(DEFAULT_CELL_LOCATION)
        Promise.all([promiseAchievement, promiseHonored, promiseDefaultCell])
            .then(async ([achievement, honored, defaultCell]) => {
                const player = await playerRepository.createAndSave(name, achievement, honored, defaultCell)
                const updateRes = await userRepository.updatePlayer(userId, player)
                if (updateRes === undefined || updateRes.affected === 0) {
                    await playerRepository.delete(player.id)
                    return reject()
                }
                return resolve(player)
            })
    })
}

async function sendConfirmationEmail(host: string|undefined, povisId: string, confirmEmailToken: string) {
    const confirmUrl = `http://${host}/user/confirm-email?confirmEmailToken=${confirmEmailToken}`

    const from = '<천공의 섬 포스텍>'
    const email = `${povisId}@postech.ac.kr`
    const subject = '가입을 위한 이메일 인증 안내'
    const content = '안녕하세요 학우님! <천공의 섬 포스텍>입니다.<br><br>'
                    + '본 메일은 학우님의 가입을 완료하기 위해 발송되었습니다. '
                    + '아래 링크를 눌러 이 메일 주소를 인증하여 주세요. '
                    + '이 메일을 받으셨더라도 아래 링크로 접속하지 않으시면 가입되지 않습니다.<br><br>'
                    + `<a href=${confirmUrl}>이메일 인증하기</a><br><br>`
                    + '위 버튼이 눌리지 않는다면 아래 주소로 접속해주세요.<br>'
                    + confirmUrl
    return sendMail(from, email, subject, content)
}