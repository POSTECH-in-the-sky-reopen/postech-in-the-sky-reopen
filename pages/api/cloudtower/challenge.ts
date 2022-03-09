// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import { battle } from 'src/util/Battle'
import { EquipedInformation } from 'src/interfaces/EquipedInformation'
import { Log } from 'src/interfaces/Log'
import { EquipableItem } from 'src/entity/Item'
import { generateCloudTowerMonster } from 'src/util/Monster'
import { getEquipments } from 'pages/api/player/equipments/get'
import { getEquipedInformation } from 'pages/api/player/status/check'
import { CLOUDTOWER_FLOOR, CLOUDTOWER_MONSTER } from 'src/util/CloudTower'
import { makeStatus } from 'src/interfaces/Status'
import { deepCopy } from 'src/util/DeepCopy'
import { AchievementRepository } from 'src/repository/AchievementRepository'

interface FloorInfo{
    monsterName?: string
    isPlayerWin?: boolean
    monsterEquipedInfo?: EquipedInformation
    eventLog?: Log[]
}

type Data = {
    playerEquipedInfo?: EquipedInformation
    floorInfos?: FloorInfo[]
    floor?: number
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']

    await prepareConnection()
    const userRepository = getCustomRepository(UserRepository)
    const achievementRepository = getCustomRepository(AchievementRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        let user = await userRepository.findOneByStudentIdSigned(studentId, ["player", "player.inventory", "player.achievement"])
        if(user===undefined){
            throw new Error("유저가 없습니다.")
        }

        const equipments = await getEquipments(user.player.id)
        
        let floor = 0
        let floorInfos = []
        const monsterStatus = makeStatus(160,140,330,30)
        const bossStatus = makeStatus(80, 160, 660, 30)
        for(floor = 0; floor < CLOUDTOWER_FLOOR; floor++){
            const equipedInfo = getEquipedInformation(equipments)
            if (equipments.Weapon === undefined || equipments.Accessory === undefined) {
                throw new Error("무기와 장신구를 모두 착용해야 도전이 가능합니다.")
            }
            if ((equipments.Weapon as EquipableItem).durability <= 0) {
                throw new Error("무기가 부서져서 탐색할 수 없습니다. 다른 무기를 차고 와주세요.")
            }
            if ((equipments.Accessory as EquipableItem).durability <= 0) {
                throw new Error("장신구가 부서져서 탐색할 수 없습니다. 다른 장신구를 차고 와주세요.")
            }

            const monster = await generateCloudTowerMonster(((floor+1)%8===0) ? bossStatus : monsterStatus, floor)

            const [isPlayerWin, battleLog, turn] = battle(equipedInfo, monster)

            let floorInfo: FloorInfo = {}

            floorInfo.eventLog = battleLog
            floorInfo.isPlayerWin = isPlayerWin
            floorInfo.monsterEquipedInfo = monster
            floorInfo.monsterName = CLOUDTOWER_MONSTER[floor]

            floorInfos.push(deepCopy(floorInfo))

            if(isPlayerWin===false){
                break
            }
        }
        await achievementRepository.updateMaxFloor(user.player.achievement.id, floor + 1)
        return res.status(200).json({
            playerEquipedInfo: getEquipedInformation(equipments),
            floorInfos: floorInfos,
            floor: floor+1
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
