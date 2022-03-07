// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import prepareConnection from "src/lib/db";
import { UserRepository } from "src/repository/UserRepository";
import { getCustomRepository } from "typeorm";
import { readToken } from "src/lib/jwt";

type Data = {
  money?: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await prepareConnection();
  const userRepository = getCustomRepository(UserRepository);
  const token = req.cookies["token"];
  try {
    const payload = readToken(token);
    const studentId = payload.studentId;
    const user = await userRepository.findOne(
      {
        studentId: studentId,
      },
      { relations: ["player"] }
    );
    if (user === undefined) {
      throw new Error("해당 학번에 해당하는 유저가 없습니다.");
    }
    if (user.player === null) {
      throw new Error("플레이어가 없습니다.");
    }
    return res.status(200).json({
      money: user.player.money,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(404).json({
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
