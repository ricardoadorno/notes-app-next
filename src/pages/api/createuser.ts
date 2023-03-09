import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        notes: {
          create: [],
        },
      },
    });
  } catch (error) {
    return res.status(409).json({ error: "User already exists" });
  }

  const token = jwt.sign(
    { email: user.email, id: user.id, time: Date.now() },
    "process.env.JWT_SECRET",
    {
      expiresIn: "1d",
    }
  );

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("ACESS_TOKEN", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );

  res.status(200).json({ user });
}
