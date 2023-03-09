import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { note_id } = req.query;

  const note = await prisma.note.update({
    where: {
      id: note_id as string,
    },
    data: {
      title: req.body.title,
      content: req.body.content,
      updatedAt: new Date(),
    },
  });

  res.json(note);
}
