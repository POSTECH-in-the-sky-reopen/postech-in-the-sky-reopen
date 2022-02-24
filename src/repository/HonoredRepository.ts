import { Achievement } from "src/entity/Achievement";
import { Honored } from "src/entity/Honored";
import { EntityRepository, Repository, UpdateResult } from "typeorm"

@EntityRepository(Honored)
export class HonoredRepository extends Repository<Honored> {

    async createAndSave(): Promise<Honored> {
        const honored = new Honored()
        honored.level = 0
        // honored.cloudTowerFloor = 0
        honored.moneyUsed = 0
        honored.items = [0,0,0,0,0]
        honored.honoredInd = -1
        honored.names = []
        return this.manager.save(honored)
    }

    async updateHonoredInd(id: number, honoredInd: number): Promise<UpdateResult> {
        return this.update(id, {
            honoredInd: honoredInd
        })
    }

    async updateNames(id: number, names: string[]): Promise<UpdateResult> {
        return this.update(id, {
            names: names
        })
    }

    async reset(id: number): Promise<UpdateResult> {
        return this.update(id, {
            level: 0,
            items: [0,0,0,0,0],
            cloudTowerFloor: 0,
            moneyUsed: 0,
            honoredInd: -1,
            names: []
        })
    }
}