import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id } = req.query;

  const { title, content } = req.body;
  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: Number(user_id),
      updatedAt: undefined,
    },
  });

  res.json(note);
}
