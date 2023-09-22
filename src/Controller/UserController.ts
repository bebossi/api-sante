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
      const { password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, salt);

      if (req.currentUser) {
        const user = await prisma.user.update({
          where: {
            id: req.currentUser.id,
          },
          data: {
            email,
            password: hashedPassword,
            role: "user",
          },
        });
        return res.status(200).json(user);
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "user",
        },
      });

      // const token = generateToken(newUser);

      return res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async loginGoogleSucces(req: Request, res: Response) {
    try {
      if (req.user) {
        const reqUser = req.user as Record<string, any>;

        const user = await prisma.user.findUnique({
          where: {
            id: reqUser.id,
          },
        });

        if (!user) {
          await prisma.user.create({
            data: {
              id: reqUser.id,
              email: reqUser.email,
              name: reqUser.displayName,
              role: "user",
            },
          });
        }

        const createdUser = await prisma.user.findUnique({
          where: {
            id: reqUser.id,
          },
        });

        const token = generateToken(createdUser!);

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          path: "/",
          // domain: "https://api-sante.onrender.com",
          sameSite: "none",
        });

        res.redirect(process.env.FRONTEND_URL as string);
      } else {
        res.status(403).json({
          error: true,
          message: "Not authorized",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
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
        return res.status(401).json({ error: "User not found" });
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
        path: "/",
        // domain: "https://api-sante.onrender.com",
        sameSite: "none",
      });

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        // token: token,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
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
        select: {
          id: true,
          password: false,
          email: true,
          role: true,
          addresses: true,
          cart: {
            include: {
              cartProducts: true,
            },
          },
          name: true,
          orders: true,
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

  async logout(req: Request, res: Response) {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "none",
      });

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
}
