import { 
    EntityRepository, Repository, UpdateResult 
} from "typeorm";
import { Region } from "src/entity/Region";
import { Cell } from "src/entity/Cell";

@EntityRepository(Region)
export class RegionRepository extends Repository<Region> {

    async findOneByName(name: string): Promise<Region> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { name: name }
            }).then(Region => {
                if (Region !== undefined) {
                    resolve(Region)
                } else {
                    reject()
                }
            })
        })
    }

    async findOneById(id: number): Promise<Region> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { id: id }
            }).then(Region => {
                if (Region !== undefined) {
                    resolve(Region)
                } else {
                    reject()
                }
            })
        })
    }

    async getCells(id: number): Promise<Cell[]> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { id: id },
                relations: ['cells']
            }).then(Region => {
                if (Region !== undefined) {
                    resolve(Region.cells)
                } else {
                    reject()
                }
            })
        })
    }

    async createAndSave(name: string, level: number): Promise<Region> {
        const region = new Region()
        region.name = name
        region.level = level
        return this.manager.save(region)
    }

}