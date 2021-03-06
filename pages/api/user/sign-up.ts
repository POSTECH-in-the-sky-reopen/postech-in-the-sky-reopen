// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository, getRepository } from "typeorm"
import Joi from "joi"
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { INITIAL_MONEY, Player } from 'src/entity/Player'
import { CellRepository } from 'src/repository/CellRepository'
import { AchievementRepository } from 'src/repository/AchievementRepository'
import { HonoredRepository } from 'src/repository/HonoredRepository'
import { DEFAULT_CELL_LOCATION } from 'src/entity/Cell'
import sendMail from 'src/lib/mail'
import { BASIC_ITEM_INFO_ID, ItemInfo } from 'src/entity/ItemInfo'
import { createItem } from '../admin/player/inventory/add-item'
import { addItemManage } from 'src/util/ItemManagement'
import { GroupInfoRepository } from 'src/repository/GroupInfoRepository'

type Data = {
    email?: string,
    message?: string
}

const schema = Joi.object({
    name: Joi.string()
        .required(),
    studentId: Joi.number()
        .min(10000000)
        .max(99999999)
        .required(),
    povisId: Joi.string()
        .required(),
    group: Joi.number()
        .min(0)
        .max(15)
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
    const { name, studentId, povisId, group, password } : { name: string, studentId: number, povisId: string, group: number, password: string } = req.body

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    try {
        await userRepository.assureNonexistByInfo(name, studentId, povisId)
        const user = await userRepository.createAndSave(name, studentId, povisId, false, password)
        await generatePlayer(user.id, user.name, group)
        
        const filterRegExp = new RegExp("(.{0,3})(.*)", "g")
        const matches = povisId.matchAll(filterRegExp)
        const match = matches.next().value
        if (match === undefined) {
            throw new Error('invalid email')
        }
        const filtered = match[1] + '*'.repeat(match[2].length) + '@postech.ac.kr'
        const confirmEmailToken = await userRepository.generateConfirmEmailToken(user.id)
        await sendConfirmationEmail(req.headers.host, user.povisId, confirmEmailToken)
        return res.status(201).json({
            email: filtered,
            message: "????????? ??????????????????."
        })
    } catch (err) {
        if (err instanceof Error) {
            return res.status(409).json({
                message: err.message,
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: "??? ??? ?????? ????????? ??????????????????.",
            });
        }
    }
}

async function generatePlayer(userId: number, name: string, groupNum: number): Promise<Player> {
    return new Promise((resolve, reject) => {
        const userRepository = getCustomRepository(UserRepository)
        const playerRepository = getCustomRepository(PlayerRepository)
        const cellRepository = getCustomRepository(CellRepository)
        const achievementRepository = getCustomRepository(AchievementRepository)
        const honoredRepository = getCustomRepository(HonoredRepository)
        const groupRepository = getCustomRepository(GroupInfoRepository)
        const promiseAchievement = achievementRepository.createAndSave()
        const promiseHonored = honoredRepository.createAndSave()
        const promiseDefaultCell = cellRepository.findOneById(DEFAULT_CELL_LOCATION)
        const promiseBasicItemInfos = getRepository(ItemInfo).findByIds(BASIC_ITEM_INFO_ID)
        const promiseGroup = groupRepository.getByNum(groupNum)
        Promise.all([promiseAchievement, promiseHonored, promiseDefaultCell, promiseBasicItemInfos, promiseGroup])
            .then(async ([achievement, honored, defaultCell, basicItemInfos, group]) => {
                if (group === undefined) {
                    return reject()
                }
                const player = await playerRepository.createAndSave(name, achievement, honored, defaultCell, group)
                const updateRes = await userRepository.updatePlayer(userId, player.id)
                if (updateRes === undefined || updateRes.affected === 0) {
                    await playerRepository.delete(player.id)
                    return reject()
                }
                for (let basicItemInfo of basicItemInfos) {
                    let item = await createItem(basicItemInfo, 0, 0)
                    await addItemManage(player, item)
                }
                await playerRepository.earnMoney(player.id, INITIAL_MONEY)
                return resolve(player)
            })
    })
}

async function sendConfirmationEmail(host: string|undefined, povisId: string, confirmEmailToken: string) {
    const confirmUrl = `http://${host}/user/confirm-email?confirmEmailToken=${confirmEmailToken}`

    const from = '<????????? ??? ?????????>'
    const email = `${povisId}@postech.ac.kr`
    const subject = '????????? ?????? ????????? ?????? ??????'
    const content = '??????????????? ?????????! <????????? ??? ?????????>?????????.<br><br>'
                    + '??? ????????? ???????????? ????????? ???????????? ?????? ?????????????????????. '
                    + '?????? ????????? ?????? ??? ?????? ????????? ???????????? ?????????. '
                    + '??? ????????? ?????????????????? ?????? ????????? ???????????? ???????????? ???????????? ????????????.<br><br>'
                    + `<a href=${confirmUrl}>????????? ????????????</a><br><br>`
                    + '??? ????????? ????????? ???????????? ?????? ????????? ??????????????????.<br>'
                    + confirmUrl
    return sendMail(from, email, subject, content)
}