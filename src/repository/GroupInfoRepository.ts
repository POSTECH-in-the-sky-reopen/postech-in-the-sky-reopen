import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { Siege } from "src/entity/Siege";
import { Cell } from "src/entity/Cell";
import { Player } from "src/entity/Player";
import { GroupInfo } from "src/entity/GroupInfo";
import { ItemCollection } from "src/entity/ItemCollection";
import { Effect } from "src/util/EffectList";

@EntityRepository(GroupInfo)
export class GroupInfoRepository extends Repository<GroupInfo> {
    async createAndSave(num: number): Promise<GroupInfo> {
        const group = new GroupInfo();
        group.num = num;
        group.occupiedCells = [];
        group.players = [];
        group.collectionMarks = [];
        group.enchantSuccess = 0
        group.equipableDrop = 0
        group.enchantDrop = 0
        group.fatigueIncrease = 0
        group.equipableReinforceSuccess = 0
        group.equipableReinforceCost = 0
        group.moneyEarn = 0
        group.coordiCost = 0
        return this.manager.save(group);
    }

    async getByNum(num: number): Promise<GroupInfo | undefined> {
        return this.findOne({ where: { num: num },relations:["itemCollections"] });
    }

    async updateBonusEffect(id: number, effect: Effect): Promise<UpdateResult>{
        return this.update(id, {
            enchantSuccess : effect.enchantSuccess,
            equipableDrop : effect.equipableDrop,
            enchantDrop : effect.enchantDrop,
            fatigueIncrease : effect.fatigueIncrease,
            equipableReinforceSuccess : effect.equipableReinforceSuccess,
            equipableReinforceCost : effect.equipableReinforceCost,
            moneyEarn : effect.moneyEarn,
            coordiCost : effect.coordiCost,
        })
    }

}
