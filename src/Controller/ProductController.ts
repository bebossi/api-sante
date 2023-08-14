import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, price, categoryId, image } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
          image,
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

  async createTopping(req: Request, res: Response) {
    try {
      const { name, description, price, quantity, image, productId } = req.body;

      const topping = await prisma.topping.create({
        data: {
          name,
          description,
          price,
          image,
          productId: productId,
        },
      });

      return res.status(200).json(topping);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        include: {
          toppings: true,
          category: true,
          cartProducts: true,
          orderProducts: true,
        },
      });

      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany();
      return res.status(200).json(categories);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { productId } = req.body;

      const product = await prisma.product.delete({
        where: {
          id: productId,
        },
      });

      return res.status(200).json(product);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          toppings: true,
        },
      });

      return res.status(200).json(product);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
}
