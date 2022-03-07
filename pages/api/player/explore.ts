// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { UserRepository } from 'src/repository/UserRepository'
import { getCustomRepository } from "typeorm"
import { readToken } from 'src/lib/jwt'
import { FATIGUE_INCREASE_AMOUNT, FATIGUE_LIMIT, MAX_NUM_EQUIPABLE_INVENTORY_EACH } from 'src/entity/Player'
import { ITEM_DROP_ENCHANT_PROBABILITY_PER_LEVEL, ITEM_DROP_EQUIPABLE_PROBABILITY_PER_LEVEL, ITEM_DROP_LEVEL_PER_LEVEL, MONEY_DROP_PER_LEVEL, MONSTER_ENCHANT_PROBABILITY_PER_LEVEL, MONSTER_STRENGTH_MULTIPLIER_PER_LEVEL, SUPPLY_APPEARANCE_RATE_PER_LEVEL } from 'src/entity/Region'
import { gacha, gachaMultiple } from 'src/lib/random'
import { battle } from 'src/util/Battle'
import { getEquipedInformation } from './status/check'
import { getEquipments } from './equipments/get'
import { MonsterInfoRepository } from 'src/repository/MonsterInfoRepository'
import { MonsterInfo } from 'src/entity/MonsterInfo'
import { EquipedInformation } from 'src/interfaces/EquipedInformation'
import { Log } from 'src/interfaces/Log'
import { PlayerRepository } from 'src/repository/PlayerRepository'
import { EquipableItemInfo } from 'src/entity/ItemInfo'
import { EnchantItemRepository, EquipableItemRepository, ItemRepository, WeaponEquipableItemRepository } from 'src/repository/ItemRepository'
import { AccessoryEquipableItem, EquipableItem, Item, WeaponEquipableItem } from 'src/entity/Item'
import { EquipableItemInfoRepository } from 'src/repository/ItemInfoRepository'
import { getItemInfo } from 'pages/api/item/get-info'
import { BattleType } from 'src/enums/BattleType'
import { flexLog, hotsixLog, repairLog, supplyFailLog, varianLog } from 'src/util/SupplyLog'
import { getNpcLog } from 'src/lib/npc'
import { AchievementRepository } from 'src/repository/AchievementRepository'
import { addItemManage } from 'src/util/ItemManagement'
import { CELL_LEVEL_RESTRICT_AMOUNT } from 'src/entity/Cell'
import { generateMonster } from 'src/util/Monster'

type Data = {
    isSupply?: boolean
    monsterInfo?: MonsterInfo
    isPlayerWin?: boolean
    eventLog?: Log[][]
    dropItem?: Item[]
    fatigueIncreased?: number
    moneyReceived?: number
    brokenItems?: Item[]
    playerEquipedInfo?: EquipedInformation
    monsterEquipedInfo?: EquipedInformation
    itemCollections?: string[]
    message?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const token = req.cookies['token']

    await prepareConnection()
    const itemRepository = getCustomRepository(ItemRepository)
    const equipableItemRepository = getCustomRepository(EquipableItemRepository)
    const weaponEquipableItemRepository = getCustomRepository(WeaponEquipableItemRepository)
    const userRepository = getCustomRepository(UserRepository)
    const playerRepository = getCustomRepository(PlayerRepository)
    const achievementRepository = getCustomRepository(AchievementRepository)
    try {
        const payload = readToken(token)
        const studentId = payload.studentId
        let user = await userRepository.findOneByStudentId(studentId, ["player", "player.inventory", "player.group", "player.location", "player.achievement", "player.location.region", "player.encounteredMonsters"])

        if (user.player.location.isCapturable) {
            throw new Error("점령전만 가능한 셀입니다.")
        }

        if (user.player.location.battleType === BattleType.NONE) {
            throw new Error("탐색이 불가능한 셀입니다.")
        }

        if (user.player.fatigue > FATIGUE_LIMIT) {
            throw new Error(`피로도가 ${FATIGUE_LIMIT}보다 커서, 탐색할 수 없습니다.`)
        }

        const equipments = await getEquipments(user.player.id)
        const equipedInfo = getEquipedInformation(equipments)
        if (equipments.Weapon === undefined || equipments.Accessory === undefined) {
            throw new Error("무기와 장신구를 모두 착용해야 탐색이 가능합니다.")
        }

        if ((equipments.Weapon as EquipableItem).durability <= 0) {
            throw new Error("무기가 부서져서 탐색할 수 없습니다. 다른 무기를 차고 와주세요.")
        }
        if ((equipments.Accessory as EquipableItem).durability <= 0) {
            throw new Error("장신구가 부서져서 탐색할 수 없습니다. 다른 장신구를 차고 와주세요.")
        }

        const regionLevel = user.player.location.region.level
        const cellLevel = user.player.location.level
        if (user.player.level + CELL_LEVEL_RESTRICT_AMOUNT < cellLevel) {
            throw new Error("레벨이 낮아 이 셀에서 탐색할 수 없습니다.")
        }


        const weaponEquipableCnt = user.player.inventory.reduce((cnt, item) =>
            cnt + ((item instanceof WeaponEquipableItem && item.durability > 0) ? 1 : 0), 0
        )
        const accessoryEquipableCnt = user.player.inventory.reduce((cnt, item) =>
            cnt + ((item instanceof AccessoryEquipableItem && item.durability > 0) ? 1 : 0), 0
        )
        if (weaponEquipableCnt >= MAX_NUM_EQUIPABLE_INVENTORY_EACH) {
            throw new Error("무기 인벤토리가 가득 차서 탐색할 수 없습니다.")
        }
        if (accessoryEquipableCnt >= MAX_NUM_EQUIPABLE_INVENTORY_EACH) {
            throw new Error("장신구 인벤토리가 가득 차서 탐색할 수 없습니다.")
        }

        const supplyAppearanceRate = SUPPLY_APPEARANCE_RATE_PER_LEVEL[regionLevel]
        const isSupply = gacha(supplyAppearanceRate)
        if (isSupply) { // 보급
            enum supplyEventList {
                Repair, Hotsix, Flex, Varian, Bang
            }
            const supplyProbList = [1, 1, 1, 1, 1]
            const supplyEvent = gachaMultiple(supplyProbList)
            let moneyReceived = 0
            let npcLog: Log[] = getNpcLog()
            let supplyLog: Log[] = []

            switch (supplyEvent) {
                case supplyEventList.Repair:
                    if (equipments.Weapon !== undefined) {
                        const itemInfo = await getItemInfo(equipments.Weapon.id) as EquipableItemInfo
                        await equipableItemRepository.updateDurability(equipments.Weapon.id, itemInfo.durability)
                    }
                    if (equipments.Accessory !== undefined) {
                        const itemInfo = await getItemInfo(equipments.Accessory.id) as EquipableItemInfo
                        await equipableItemRepository.updateDurability(equipments.Accessory.id, itemInfo.durability)
                    }
                    supplyLog = repairLog(supplyLog)
                    break
                case supplyEventList.Hotsix:
                    await playerRepository.resetFatigue(user.player.id)
                    supplyLog = hotsixLog(supplyLog)
                    break
                case supplyEventList.Flex:
                    moneyReceived = MONEY_DROP_PER_LEVEL[regionLevel] * 2
                    await playerRepository.earnMoney(user.player.id, moneyReceived)
                    supplyLog = flexLog(supplyLog)
                    break
                case supplyEventList.Varian:
                    if (equipments.Weapon !== undefined) {
                        const itemInfo = await getItemInfo(equipments.Weapon.id) as EquipableItemInfo
                        const copiedItem = await equipableItemRepository.createAndSave(itemInfo, (equipments.Weapon as EquipableItem).level, (equipments.Weapon as EquipableItem).sharpness)
                        await itemRepository.updateInventory(copiedItem.id, user.player)
                        await weaponEquipableItemRepository.updateEnchant(copiedItem.id, (equipments.Weapon as WeaponEquipableItem).enchantItemInfo)
                        await equipableItemRepository.updateDurability(equipments.Weapon.id, (equipments.Weapon as EquipableItem).durability / 2)
                        await equipableItemRepository.updateDurability(copiedItem.id, (equipments.Weapon as EquipableItem).durability / 2)
                        supplyLog = varianLog(supplyLog)
                    } else {
                        supplyLog = supplyFailLog(supplyLog)
                    }
                    break
                case supplyEventList.Bang:
                    supplyLog = supplyFailLog(supplyLog)
                    break
                default:
                    break
            }
            return res.status(200).json({
                isSupply: true,
                eventLog: [npcLog, supplyLog],
                moneyReceived: moneyReceived
            })

        } else { // 탐색
            const battleType = user.player.location.battleType

            // 지역의 속성에 맞는 몬스터 랜덤으로 결정
            const monsterInfoRepository = getCustomRepository(MonsterInfoRepository)
            const monsterInfo = await monsterInfoRepository.findOneRandom(battleType)

            // 지역 레벨과 셀 레벨 기반으로 몬스터 세부 능력치와 인챈트 여부 결정
            const monster = await generateMonster(monsterInfo, regionLevel, cellLevel)

            // 전투 진행
            const [isPlayerWin, battleLog, turn] = battle(equipedInfo, monster)

            // 내구도 감소
            const equipableItemRepository = getCustomRepository(EquipableItemRepository)
            const promiseWeaponDec = equipableItemRepository.decreaseDurability(equipments.Weapon.id, turn)
            const promiseAccessoryDec = equipableItemRepository.decreaseDurability(equipments.Accessory.id, turn)
            await Promise.all([promiseWeaponDec, promiseAccessoryDec])

            // 무기 내구도 0 이하일 경우 장착 해제
            let brokenItems = []
            let weapon = await equipableItemRepository.findOne(equipments.Weapon.id)
            if (weapon !== undefined) {
                if (weapon.durability <= 0) {
                    weapon.equiped = false
                    await weapon.save()
                    brokenItems.push(weapon)
                }
            }

            let accessory = await equipableItemRepository.findOne(equipments.Accessory.id)
            if (accessory !== undefined) {
                if (accessory.durability <= 0) {
                    accessory.equiped = false
                    await accessory.save()
                    brokenItems.push(accessory)
                }
            }

            // 업적용 정보 관리
            let maxDamage = 0
            for (let bl of battleLog) {
                if (bl.LogType === "Attack") {
                    if (bl.IsPlayerAttack) {
                        maxDamage = Math.max(bl.Damage, 0)
                    }
                }
            }
            await achievementRepository.updateMaxDamage(user.player.achievement.id, maxDamage)
            await achievementRepository.updateMaxTurn(user.player.achievement.id, turn)

            // 졌을 경우, 피로도만 대폭 증가
            if (!isPlayerWin) {
                const fatigueIncreased = FATIGUE_INCREASE_AMOUNT.lose
                await playerRepository.incFatigue(user.player.id, Math.max(fatigueIncreased - user.player.group.fatigueIncrease, 1))
                await achievementRepository.updateLoseCount(user.player.achievement.id)
                return res.status(200).json({
                    isSupply: false,
                    monsterInfo: monsterInfo,
                    isPlayerWin: isPlayerWin,
                    eventLog: [battleLog],
                    fatigueIncreased: fatigueIncreased,
                    brokenItems: brokenItems,
                    playerEquipedInfo: equipedInfo,
                    monsterEquipedInfo: monster
                })
            }

            // 이겼을 경우, 플레이어 레벨 갱신
            await playerRepository.updateLevel(user.player.id, cellLevel)


            // 이겼을 경우, 몬스터 도감에 추가
            try {
                await playerRepository.addEncounteredMonster(user.player.id, monsterInfo)
            } catch (err) {

            }


            let itemCollections: string[] = []
            let dropItem = []
            // 이겼을 경우, 몬스터의 속성에 맞는 장비 아이템 드랍
            if (gacha(ITEM_DROP_EQUIPABLE_PROBABILITY_PER_LEVEL[regionLevel] + user.player.group.equipableDrop)) {
                const equipableItemInfoRepository = getCustomRepository(EquipableItemInfoRepository)

                const itemInfo = await equipableItemInfoRepository.findOneRandom(battleType)

                const itemLevel = gachaMultiple(ITEM_DROP_LEVEL_PER_LEVEL[regionLevel])
                const item = await equipableItemRepository.createAndSave(itemInfo, itemLevel, 0)
                itemCollections.concat(await addItemManage(user.player, item))
                dropItem.push(item)
            }

            // 이겼을 경우, 몬스터가 들고 있는 인챈트 아이템 드랍
            if (monster.enchantItemInfo && gacha(ITEM_DROP_ENCHANT_PROBABILITY_PER_LEVEL[regionLevel] + user.player.group.enchantDrop)) {
                // if (monster.enchantItemInfo) {
                const enchantItemRepository = getCustomRepository(EnchantItemRepository)

                const item = await enchantItemRepository.createAndSave(monster.enchantItemInfo)
                itemCollections.concat(await addItemManage(user.player, item))
                dropItem.push(item)
            }

            // 이겼을 경우, 피로도 소폭 증가
            const fatigueIncreased = FATIGUE_INCREASE_AMOUNT.win
            await playerRepository.incFatigue(user.player.id, Math.max(fatigueIncreased - user.player.group.fatigueIncrease, 1))

            // 이겼을 경우, 재화 부여
            const moneyReceived = Math.round(MONEY_DROP_PER_LEVEL[regionLevel] * (100 + user.player.group.moneyEarn) / 100)
            await playerRepository.earnMoney(user.player.id, moneyReceived)

            return res.status(200).json({
                isSupply: false,
                monsterInfo: monsterInfo,
                isPlayerWin: isPlayerWin,
                eventLog: [battleLog],
                dropItem: dropItem,
                fatigueIncreased: fatigueIncreased,
                moneyReceived: moneyReceived,
                brokenItems: brokenItems,
                playerEquipedInfo: equipedInfo,
                monsterEquipedInfo: monster,
                itemCollections: itemCollections
            })
        }
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
