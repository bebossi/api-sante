import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../config/jwt.config";

const prisma = new PrismaClient();

export class UserController {
  async signUp(req: Request, res: Response) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    try {
      const { name, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      await prisma.cart.create({
        data: {
          userId: newUser.id,
        },
      });

      return res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.status(401);
      }
      const isValidPassword = bcrypt.compare(password, user.password!);

      if (!isValidPassword) {
        return res.status(401);
      }
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
        },
        token: token,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const user = await prisma.user.update({
        where: {
          id: req.currentUser?.id,
        },
        data: {
          name,
          email,
          password,
          role,
        },
      });

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}
