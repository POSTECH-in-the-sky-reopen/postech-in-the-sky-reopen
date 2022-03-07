// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prepareConnection from 'src/lib/db'
import { getCustomRepository } from "typeorm"
import Joi from "joi"
import { SiegeRepository } from 'src/repository/SiegeRepository'
import { PhaseRepository } from 'src/repository/PhaseRepository'
import { CellRepository } from 'src/repository/CellRepository'
import { deepCopy } from 'src/util/DeepCopy'
import { GroupInfoRepository } from 'src/repository/GroupInfoRepository'


export interface Hash {
    [details: number]: number;
}

export interface DHash {
    [details: number]: Hash;
}

type Data = {
    cellOccupation? : Hash
    cellGroupInfoDamage?: DHash
    message?: string
}

const schema = Joi.object({
    phase: Joi.number()
});


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const validateRes = schema.validate(req.body);
    if (validateRes.error) {
        return res.status(400).json({
            message: validateRes.error.message,
        });
    }
    let { phase }: { phase: number|undefined } = req.body;
    await prepareConnection()
    try {
        const phaseRepository = getCustomRepository(PhaseRepository)
        const siegeRepository = getCustomRepository(SiegeRepository)
        const cellRepository = getCustomRepository(CellRepository)
        const groupRepository = getCustomRepository(GroupInfoRepository)
        const cells = await cellRepository.find({
            where: {
                isCapturable: true
            }
        })
        if (phase === undefined) {
            phase = (await phaseRepository.find())[0].phase;
        }
        const sieges = await siegeRepository.find({
            where: {
                phase: phase
            },
            relations: ["player", "cell", "player.group"]
        })
        let cellGroupInfoDamage: DHash = {}
        let cellOccupation: Hash = {}
        for (let i = 0; i < cells.length; i++) {
            let groupDamage: Hash = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
            }
            cellGroupInfoDamage[cells[i].id] = deepCopy(groupDamage)
        }
        for (let i = 0; i < sieges.length; i++) {
            const siege = sieges[i]
            cellGroupInfoDamage[siege.cell.id][siege.player.group.num] += siege.damage
        }
        for (let i = 0; i < cells.length; i++) {
            const groupDamage = cellGroupInfoDamage[cells[i].id]
            let maxDamageGroupInfo = 0
            let maxDamage = 0
            for (let j = 0; j < 16; j++) {
                if(maxDamage < groupDamage[j]){
                    maxDamage = groupDamage[j]
                    maxDamageGroupInfo = j
                }
            }
            cellOccupation[cells[i].id] = maxDamageGroupInfo
            
            const group = await groupRepository.findOne({where: {num: maxDamageGroupInfo}})
            if(group === undefined){
                throw new Error("no group")
            }
            await cellRepository.updateGroup(cells[i].id, group);
        }
        return res.status(201).json({
            cellOccupation: cellOccupation,
            cellGroupInfoDamage: cellGroupInfoDamage
        })
    } catch (err) {
        return res.status(400).json({
            message: '알 수 없는 이유로 실패했습니다.'
        })
    }
}
