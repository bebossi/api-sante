import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

declare module "express" {
  interface Request {
    currentUser?: User;
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // const { authorization } = req.headers;

    const token = req.cookies.token;

    // if (!authorization) {
    //   return res.sendStatus(403);
    // }
    if (!token) {
      return res.sendStatus(403);
    }

    // const token = authorization.replace("Bearer", "").trim();
    const secret = process.env.TOKEN_SIGN_SECRET as string;

    const data = jwt.verify(token, secret) as User;
    const user = await prisma.user.findUnique({ where: { id: data.id } });

    if (user?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
