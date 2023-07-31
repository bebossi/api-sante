import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class OrderController {
  async addProduct(req: Request, res: Response) {
    try {
      const { productIds } = req.body;
      const userId = req.currentUser?.id as string;

      const products = await prisma.product.findMany({
        where: {
          id: { in: [productIds] },
        },
      });

      const productsData = products.map((product) => ({ id: product.id }));

      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          products: true,
        },
      });

      await prisma.cart.update({
        where: {
          id: cart?.id,
        },
        data: {
          products: {
            connect: productsData,
          },
        },
        include: {
          products: true,
        },
      });

      return res.status(200).json(cart);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async removeProduct(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      const userId = req.currentUser?.id as string;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          products: true,
        },
      });

      const productsData = cart?.products.filter(
        (product) => product.id !== productId
      );

      const updatedCart = await prisma.cart.update({
        where: {
          id: cart?.id,
        },
        data: {
          products: {
            set: productsData,
          },
        },
      });

      return res.status(200).json(updatedCart);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async removeAll(req: Request, res: Response) {
    try {
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
}
