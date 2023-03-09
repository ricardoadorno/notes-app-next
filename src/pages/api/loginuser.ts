import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.json({ message: "Incorrect password" });
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

  res.status(200).json({ message: "Login successful", user_url: user.id });
}
