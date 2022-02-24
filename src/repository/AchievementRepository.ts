import { Achievement } from "src/entity/Achievement";
import { EntityRepository, Repository, UpdateResult } from "typeorm"

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {

    async createAndSave(): Promise<Achievement> {
        const achievement = new Achievement()
        return this.manager.save(achievement)
    }

    async updateWholeBossDamage(id: number, damage: number):Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(Achievement)
            .set({ wholeBossDamage: () => `wholeBossDamage + ${damage}` })
            .where({ id: id })
            .execute();
    }

    async updateWholeGachaMoney(id: number, cost: number):Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(Achievement)
            .set({ moneyUsed: () => `moneyUsed + ${cost}` })
            .where({ id: id })
            .execute();
    }

    async updateLoseCount(id: number):Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(Achievement)
            .set({ loseCount: () => `loseCount + 1` })
            .where({ id: id })
            .execute();
    }
    
    async updateMaxDamage(id: number, _maxDamage: number):Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(Achievement)
            .set({ maxDamage: () => `GREATEST(maxDamage , ${_maxDamage})` })
            .where({ id: id })
            .execute();
    }
    
    async updateMaxFloor(id: number, _maxFloor: number):Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(Achievement)
            .set({ cloudTowerFloor: () => `GREATEST(cloudTowerFloor , ${_maxFloor})` })
            .where({ id: id })
            .execute();
    }

    async updateMaxTurn(id: number, _maxTurn: number):Promise<UpdateResult>{
        return this.createQueryBuilder()
            .update(Achievement)
            .set({ maxTurn: () => `GREATEST(maxTurn , ${_maxTurn})` })
            .where({ id: id })
            .execute();
    }
}