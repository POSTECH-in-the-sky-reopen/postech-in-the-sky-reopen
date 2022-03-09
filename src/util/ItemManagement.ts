import { ResultSetHeader } from "mysql2";
import { GroupInfo } from "src/entity/GroupInfo";
import { Item } from "src/entity/Item";
import { Player } from "src/entity/Player";
import { GroupInfoRepository } from "src/repository/GroupInfoRepository";
import { ItemRepository } from "src/repository/ItemRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { getCustomRepository, getRepository, Raw, UpdateResult } from "typeorm";
import { deepCopy } from "./DeepCopy";
import { addEffect, getEffect } from "./EffectList";
import { addMark, checkMark, marksToString } from "./Mark";

export async function addItemManage(
    _player: Player,
    _item: Item
): Promise<string[]> {
    const playerRepository = getCustomRepository(PlayerRepository);
    const itemRepository = getCustomRepository(ItemRepository);
    const groupRepository = getCustomRepository(GroupInfoRepository);

    // 아이템 추가

    const player = await playerRepository.findOne(_player.id, {
        relations: ["group", "group.itemCollections", "foundItemInfo"],
    });
    const item = await itemRepository.findOne(_item.id, {
        relations: ["itemInfo", "itemInfo.itemCollections", "itemInfo.finders"],
    });

    try {
        if (player === undefined) {
            throw new Error("플레이어가 없습니다.");
        }
        if (item === undefined) {
            throw new Error("아이템이 없습니다.");
        }
        if (item.itemInfo === undefined) {
            throw new Error("아이템 정보가 없습니다.");
        }
        await playerRepository.addItem(player.id, item);

        // 아이템 도감에 추가
        let added = await playerRepository.addEncounteredItem(player.id, item.itemInfo)
        if (!added) {
            return []
        }

        let findersPromise = [];
        for (let _finder of item.itemInfo.finders) {
            const finder = playerRepository.findOne(_finder.id, {
                relations: ["group"],
            });
            findersPromise.push(finder);
        }

        const finders = (await Promise.all(findersPromise)).filter(
            (f) => f !== undefined
        ) as Player[];

        if (finders.findIndex((f) => f.group.num === player.group.num) !== -1) {
            return [] // 분반에서 이미 등록된 아이템
        }

        // 발견 아이템 마킹
        item.itemInfo.finders.push(player);
        await item.itemInfo.save();
        // console.log("item marked");
        
        // 컬렉션 검색
        const itemCollections = item.itemInfo.itemCollections;
        let itemCollectionsName = []
        for (let itemCollection of itemCollections) {
            let collectionIndex = player.group.itemCollections.findIndex(
                (ic) => ic.id == itemCollection.id
            );
            if (collectionIndex === -1) {
                return [] // 
            }
            
            let mark: number;
            let resultSetHeader: ResultSetHeader;
            do{
                mark = addMark(
                    player.group.collectionMarks[collectionIndex],
                    itemCollection.itemInfos,
                    item.itemInfo
                );
                // console.log(mark)
                if (mark === player.group.collectionMarks[collectionIndex]){
                    break // 이미 등록됨
                }
                let newMarks: number[] = deepCopy(player.group.collectionMarks)
                newMarks[collectionIndex] = mark
                console.error(
                    'UPDATE `group_info` '
                    + `SET collectionMarks = \'${marksToString(newMarks)}\' `
                    + `WHERE num = ${player.group.num} `
                    + `AND collectionMarks = \'${marksToString(player.group.collectionMarks)}\';`
                )
                try {
                    resultSetHeader = await getRepository(GroupInfo).query(
                        'UPDATE `group_info` '
                        + `SET collectionMarks = \'${marksToString(newMarks)}\' `
                        + `WHERE num = ${player.group.num} `
                        + `AND collectionMarks = \'${marksToString(player.group.collectionMarks)}\';`
                    )
                    // console.log(resultSetHeader)
                    // if(resultSetHeader !== undefined){
                    //     console.log(resultSetHeader.changedRows === 0)
                    // }
                } catch(err){
                    throw err;
                }
                if (resultSetHeader.changedRows) {
                    break
                }
                player.group.reload()
            } while(true)
            // console.log(collectionIndex)
            // console.log("item collected");
    
            // 컬렉션 활성화 검사
            if (checkMark(mark, itemCollection.itemInfos)) {
                // console.log("effect applied");
                // 보너스 이펙트 적용
                //console.log(itemCollection.name)
                //console.log(getEffect(itemCollection.name))
                await groupRepository.updateBonusEffect(
                    player.group.id,
                    addEffect(player.group, getEffect(itemCollection.name))
                );
            }
            itemCollectionsName.push(itemCollection.name);
        }
        return itemCollectionsName;
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            throw err;
        } else {
            console.error(err);
            throw new Error('알 수 없는 오류가 발생했습니다.')
        }
    }
}
