import { Cart, CartToProduct, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class OrderController {
  async addProduct(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      const userId = req.currentUser?.id as string;

      const addProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!addProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const cart = await prisma.cart.findUnique({
        where: {
          userId,
        },
        include: {
          products: true,
        },
      });

      let existingProduct: CartToProduct | undefined;

      existingProduct = cart?.products.find((item) => {
        return item.productId === productId;
      });

      if (existingProduct) {
        await prisma.cartToProduct.update({
          where: {
            id: existingProduct.id,
          },
          data: {
            quantity: existingProduct.quantity + 1,
            price: Number(addProduct.price) * (existingProduct.quantity + 1),
          },
        });
      } else {
        existingProduct = await prisma.cartToProduct.create({
          data: {
            cartId: cart?.id as string,
            productId: productId,
            quantity: 1,
            price: Number(addProduct.price),
          },
        });
      }

      const cartWithNewProduct = await prisma.cart.findUnique({
        where: {
          id: cart?.id,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      const subtotal = cartWithNewProduct?.products.reduce(
        (total, productToCart) => {
          return total + Number(productToCart.price);
        },
        0
      );

      const updatedCart = await prisma.cart.update({
        where: {
          id: cart?.id,
        },
        data: {
          products: {
            connect: {
              id: existingProduct.id,
            },
          },
          subtotal: subtotal,
        },
        include: {
          products: true,
        },
      });

      return res.status(200).json(updatedCart);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async removeProduct(req: Request, res: Response) {
    try {
      const { productId } = req.body;
      const userId = req.currentUser?.id as string;

      const removedProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!removedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          products: true,
        },
      });

      let existingProduct: CartToProduct | undefined;

      existingProduct = cart?.products.find((item) => {
        return item.productId === productId;
      });

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (existingProduct && existingProduct?.quantity > 1) {
        await prisma.cartToProduct.update({
          where: {
            id: existingProduct.id,
            cartId: cart?.id,
          },
          data: {
            quantity: existingProduct.quantity - 1,
            price:
              Number(removedProduct.price) * (existingProduct.quantity - 1),
          },
        });
      } else {
        await prisma.cartToProduct.delete({
          where: {
            id: existingProduct?.id,
            cartId: cart?.id,
          },
        });
      }

      const updatedddCart = await prisma.cart.findUnique({
        where: {
          id: cart?.id,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      const subtotal = updatedddCart?.products.reduce(
        (total, productToCart) => {
          return total + Number(productToCart.price);
        },
        0
      );

      const updatedCart = await prisma.cart.update({
        where: {
          id: cart?.id,
        },
        data: {
          subtotal: subtotal,
        },
        include: {
          products: {
            include: {
              product: true,
            },
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
      const userId = req.currentUser?.id;

      const cart = await prisma.cart.update({
        where: {
          userId: userId,
        },
        data: {
          products: {
            set: [],
          },
        },
      });

      return res.status(200).json(cart);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async checkout(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      const productsInCart = await prisma.cartToProduct.findMany({
        where: {
          cartId: cart?.id,
        },
      });
      console.log(productsInCart);
      const order = await prisma.order.create({
        data: {
          userId: userId as string,
          subTotal: Number(cart?.subtotal),
          total: 0,
          products: {
            create: productsInCart.map((cartProduct) => ({
              productId: cartProduct.productId,
              quantity: cartProduct.quantity,
              price: cartProduct.price,
            })),
          },
        },
      });

      return res.status(201).json(order);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
}
