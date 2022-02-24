import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { UserRepository } from "src/repository/UserRepository";
import { PlayerRepository } from "src/repository/PlayerRepository";
import { getCustomRepository } from "typeorm";
import { readToken } from "src/lib/jwt";
import Joi from "joi";

type Data = {
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = req.cookies["token"];

  await prepareConnection();
  const userRepository = getCustomRepository(UserRepository);
  const playerRepository = getCustomRepository(PlayerRepository);
  try {
    const payload = readToken(token);
    const studentId = payload.studentId;
    let user = await userRepository.findOneByStudentId(studentId, ["player"]);
    const updateResult = await playerRepository.refreshFatigue(user.player.id);
    if (updateResult.affected === 0) {
      throw new Error("재화가 부족합니다.");
    }
    return res.status(200).json({});
  } catch (err) {
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
