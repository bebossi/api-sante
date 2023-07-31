import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, categoryId } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
        },
      });

      return res.status(200).json(product);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;

      const category = await prisma.category.create({
        data: {
          name,
        },
      });

      return res.status(200).json(category);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
}
