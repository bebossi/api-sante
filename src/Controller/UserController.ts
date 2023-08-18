import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../config/jwt.config";
import auth0Client from "../config/auth0.config";

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

      return res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
    }
  }

  async guestUser(req: Request, res: Response) {
    try {
      const guestUser = await prisma.user.create({
        data: {
          role: "guest",
        },
      });

      const token = generateToken(guestUser);

      const guestCart = await prisma.cart.create({
        data: {
          userId: guestUser.id,
          subtotal: 0,
        },
      });

      return res.status(200).json({ guestUser, token });
    } catch (err) {
      console.log(err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email },
        include: {
          cart: true,
        },
      });

      if (!user) {
        return res.status(401);
      }
      const isValidPassword = bcrypt.compare(password, user.password!);

      if (!isValidPassword) {
        return res.status(401);
      }
      const token = generateToken(user);

      if (!user.cart) {
        await prisma.cart.create({
          data: {
            userId: user.id,
            subtotal: 0,
          },
        });
      }
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

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

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  async createAddress(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;
      const { street, neighborhood, streetNumber, complementNumber, CEP } =
        req.body;

      const address = await prisma.address.create({
        data: {
          userId: userId as string,
          street: street,
          neighborhood: neighborhood,
          streetNumber: Number(streetNumber),
          complementNumber: Number(complementNumber),
          CEP: Number(CEP),
        },
      });

      return res.status(200).json(address);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}
