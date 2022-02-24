import { GroupInfo } from "src/entity/GroupInfo";
import { 
    EntityRepository, LessThanOrEqual, Repository, UpdateResult 
} from "typeorm";
import { Cell, CELL_LEVEL_RESTRICT_AMOUNT } from "src/entity/Cell";
import { Region } from "src/entity/Region";
import { BattleType } from "src/enums/BattleType";

@EntityRepository(Cell)
export class CellRepository extends Repository<Cell> {

    async findOneById(id: number, relations: string[] = []): Promise<Cell> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { id: id },
                relations: relations
            }).then(cell => {
                if (cell !== undefined) {
                    resolve(cell)
                } else {
                    reject()
                }
            })
        })
    }

    async createAndSave(name: string, region: Region, battleType: BattleType, isCapturable: boolean, isTeleportable: boolean, isEnding: boolean, cellLevel: number, adjacentCells: Cell[]): Promise<Cell> {
        const cell = new Cell()
        cell.name = name
        cell.region = region
        cell.battleType = battleType
        cell.isCapturable = isCapturable
        cell.isTeleportable = isTeleportable
        cell.isEnding = isEnding
        cell.level = cellLevel
        cell.adjEast = adjacentCells[0]
        cell.adjWest = adjacentCells[1]
        cell.adjSouth = adjacentCells[2]
        cell.adjNorth = adjacentCells[3]
        return this.manager.save(cell)
    }

    async updateAndSave(cell: Cell, adjacentCells: Cell[]): Promise<Cell> {
        cell.adjEast = adjacentCells[0]
        cell.adjWest = adjacentCells[1]
        cell.adjSouth = adjacentCells[2]
        cell.adjNorth = adjacentCells[3]
        return cell.save()
    }

    async updateGroup(id:number, group:GroupInfo):Promise<UpdateResult>{
        return this.update(id,{
            group: group
        })
    }

    async getTeleportableCells(): Promise<Cell[]>{
        return this.find({
            isTeleportable: true
        })
    }

    async getVisitableCells(playerLevel: number): Promise<Cell[]>{
        return this.find({
            level: LessThanOrEqual(playerLevel + CELL_LEVEL_RESTRICT_AMOUNT)
        })
    }

    async getSiegeCells(): Promise<Cell[]>{
        return this.find({
            isCapturable: true
        })
    }

    async getEndingCells(): Promise<Cell[]>{
        return this.find({
            isEnding: true
        })
    }

}