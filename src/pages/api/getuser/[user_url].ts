import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateRoute } from "../../../lib/auth";

export default validateRoute(
  async (req: NextApiRequest, res: NextApiResponse, userOnSession) => {
    if (userOnSession.id !== Number(req.query.user_url)) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.query.user_url),
      },
      include: {
        notes: true,
      },
    });

    res.json(user);
  }
);
