import { AVG_CELL_PER_REGION } from "src/entity/Cell"
import { MonsterInfo } from "src/entity/MonsterInfo"
import { MONSTER_ENCHANT_PROBABILITY_PER_LEVEL } from "src/entity/Region"
import { BattleType } from "src/enums/BattleType"
import { EquipedInformation } from "src/interfaces/EquipedInformation"
import { calculateBaseStatus, improveStatusMonster, makeStatus, mulStatus, Status } from "src/interfaces/Status"
import { gacha } from "src/lib/random"
import { EnchantItemInfoRepository } from "src/repository/ItemInfoRepository"
import { getCustomRepository } from "typeorm"
import { CLOUDTOWER_ENCHANT, floorCut } from "./CloudTower"



export async function generateMonster(monsterInfo: MonsterInfo, regionLevel: number, cellLevel: number): Promise<EquipedInformation> {
    return new Promise(async (resolve, reject) => {
        const hasEnchant = gacha(MONSTER_ENCHANT_PROBABILITY_PER_LEVEL[regionLevel])
        let enchantItemInfo = undefined
        if (hasEnchant) {
            const enchantItemInfoRepository = getCustomRepository(EnchantItemInfoRepository)
            enchantItemInfo = await enchantItemInfoRepository.findDroppableOneRandom()
        }
        return resolve({
            status: improveStatusMonster(regionLevel, calculateBaseStatus(monsterInfo.minStatus, monsterInfo.maxStatus, (cellLevel % AVG_CELL_PER_REGION) / AVG_CELL_PER_REGION)),
            attackBattleType: monsterInfo.battleType,
            defenseBattleType: monsterInfo.battleType,
            enchantItemInfo: enchantItemInfo,
        })
    })
}

export async function generateCloudTowerMonster(status: Status, floor: number): Promise<EquipedInformation> {
    return new Promise(async (resolve, reject) => {

        const enchantItemInfoRepository = getCustomRepository(EnchantItemInfoRepository)
        let enchantItemInfo = await enchantItemInfoRepository.findOne({where:{name: CLOUDTOWER_ENCHANT[floor]}})
        if(enchantItemInfo === undefined){
            return reject("no enchantItemInfo")
        }

        const [c, v]  = floorCut(floor)
        const difficulty = 3
        if(floor > 32) { // 32층 이상
            const mul = difficulty + (floor-32) / 5
            const improveStatus = makeStatus(mul,mul,mul,mul)
            return resolve({
                status: improveStatusMonster(5, mulStatus(status, improveStatus)),
                attackBattleType: BattleType.NONE,
                defenseBattleType: BattleType.NONE,
                enchantItemInfo: enchantItemInfo,
            })
        }

        return resolve({
            status: improveStatusMonster(c + difficulty, status),
            attackBattleType: BattleType.NONE,
            defenseBattleType: BattleType.NONE,
            enchantItemInfo: enchantItemInfo,
        })
    })
}