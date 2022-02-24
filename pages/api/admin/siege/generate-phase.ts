import { NextApiRequest, NextApiResponse } from "next";
import { getCustomRepository } from "typeorm";
import prepareConnection from "src/lib/db";
import { PhaseRepository } from "src/repository/PhaseRepository";

type Data = {
    message?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await prepareConnection();
    const phaseRepository = getCustomRepository(PhaseRepository)
    try {
        const phaseNum = (await phaseRepository.find()).length
        if(phaseNum>0){
            throw new Error("already has phase")
        }
        const phase = await phaseRepository.createAndSave(0)
        return res.status(200).json({
			message: phase.id.toString()
		});
    } catch(err) {
        if (err instanceof Error) {
            return res.status(400).json({
                message: err.message,
            });
        } else {
            console.error(err);
            return res.status(500).json({
                message: "알 수 없는 오류가 발생했습니다.",
            });
        }
    }
}
