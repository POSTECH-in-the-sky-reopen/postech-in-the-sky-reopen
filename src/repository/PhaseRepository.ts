import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { Phase } from "src/entity/Phase";

@EntityRepository(Phase)
export class PhaseRepository extends Repository<Phase> {

    async findOneById(id: number): Promise<Phase> {
        return new Promise((resolve, reject) => {
            this.findOne({
                where: { id: id }
            }).then(phase => {
                if (phase !== undefined) {
                    resolve(phase)
                } else {
                    reject()
                }
            })
        })
    }

    async updatePhase(id:number, phase: number): Promise<UpdateResult>{
        return this.update(id,{
            phase: phase
        })
    }

    async createAndSave(_phase: number): Promise<Phase> {
        const phase = new Phase()
        phase.phase = _phase
        return this.manager.save(phase)
    }


}