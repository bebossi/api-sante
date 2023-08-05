import {
  Topping,
  CartToProduct,
  PrismaClient,
  OrderToProductTopping,
} from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class OrderController {
  async addProductWToppings(req: Request, res: Response) {
    try {
      const { productId, toppings, quantity } = req.body;

      const userId = req.currentUser?.id as string;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          cartProducts: {
            include: {
              product: true,
              cartToProductToppings: true,
            },
          },
        },
      });

      const addProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          toppings: {
            include: {
              cartToProductToppings: true,
            },
          },
        },
      });

      if (!addProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      let existingProduct: CartToProduct | undefined;

      existingProduct = cart?.cartProducts.find((item) => {
        return item.productId === productId;
      });

      let toppingsPrice = 0;

      if (existingProduct) {
        for (const topping of toppings) {
          const selectedTopping = addProduct.toppings.find((item) => {
            return item.id === topping.topping.id;
          });
          if (selectedTopping) {
            await prisma.cartToProductTopping.create({
              data: {
                cartToProdId: existingProduct.id,
                toppingId: String(topping.topping.id),
                quantity: topping.quantity,
              },
            });
            toppingsPrice += selectedTopping.price * Number(topping.quantity);
          }
        }

        await prisma.cartToProduct.update({
          where: {
            id: existingProduct.id,
          },
          data: {
            quantity: existingProduct.quantity + 1,
            price:
              existingProduct.price + Number(addProduct.price) + toppingsPrice,
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

        for (const topping of toppings) {
          const selectedTopping = addProduct.toppings.find(
            (item) => item.id === topping.topping.id
          );

          if (selectedTopping) {
            await prisma.cartToProductTopping.create({
              data: {
                toppingId: selectedTopping.id,
                cartToProdId: existingProduct.id,
                quantity: Number(topping.quantity),
              },
            });
            toppingsPrice += selectedTopping.price * Number(topping.quantity); // Calculate the toppings price
          }
        }

        await prisma.cartToProduct.update({
          where: {
            id: existingProduct.id,
          },
          data: {
            price: Number(addProduct.price) + Number(toppingsPrice),
          },
        });
      }

      const cartWithNewProduct = await prisma.cart.findUnique({
        where: {
          id: cart?.id,
        },
        include: {
          cartProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      const subtotal = cartWithNewProduct?.cartProducts.reduce(
        (total, cartProduct) => {
          return total + Number(cartProduct.price);
        },
        0
      );

      const updatedCart = await prisma.cart.update({
        where: {
          id: cart?.id,
        },
        data: {
          cartProducts: {
            connect: {
              id: existingProduct.id,
            },
          },
          subtotal: subtotal,
        },
        include: {
          cartProducts: {
            include: {
              cartToProductToppings: true,
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

  // async addProduct(req: Request, res: Response) {
  //   try {
  //     const { productId } = req.body;
  //     const userId = req.currentUser?.id as string;

  //     const addProduct = await prisma.product.findUnique({
  //       where: {
  //         id: productId,
  //       },
  //       include: {
  //         toppings: {
  //           include: {
  //             cartToProductToppings: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!addProduct) {
  //       return res.status(404).json({ error: "Product not found" });
  //     }
  //     const toppings = addProduct.toppings;

  //     let toppingPrice = 0;
  //     for (const topping of toppings) {
  //       const selectedTopping = toppings.find((item) => {
  //         item.id;
  //       });
  //     }

  //     const cart = await prisma.cart.findUnique({
  //       where: {
  //         userId,
  //       },
  //       include: {
  //         cartProducts: true,
  //       },
  //     });

  //     let existingProduct: CartToProduct | undefined;

  //     existingProduct = cart?.cartProducts.find((item) => {
  //       return item.productId === productId;
  //     });

  //     if (existingProduct) {
  //       await prisma.cartToProduct.update({
  //         where: {
  //           id: existingProduct.id,
  //         },
  //         data: {
  //           quantity: existingProduct.quantity + 1,
  //           price: Number(addProduct.price) * (existingProduct.quantity + 1),
  //         },
  //       });
  //     } else {
  //       existingProduct = await prisma.cartToProduct.create({
  //         data: {
  //           cartId: cart?.id as string,
  //           productId: productId,
  //           quantity: 1,
  //           price: Number(addProduct.price),
  //         },
  //       });
  //     }

  //     const cartWithNewProduct = await prisma.cart.findUnique({
  //       where: {
  //         id: cart?.id,
  //       },
  //       include: {
  //         cartProducts: {
  //           include: {
  //             product: true,
  //           },
  //         },
  //       },
  //     });

  //     const subtotal = cartWithNewProduct?.cartProducts.reduce(
  //       (total, cartProduct) => {
  //         return total + Number(cartProduct.price);
  //       },
  //       0
  //     );

  //     const updatedCart = await prisma.cart.update({
  //       where: {
  //         id: cart?.id,
  //       },
  //       data: {
  //         cartProducts: {
  //           connect: {
  //             id: existingProduct.id,
  //           },
  //         },
  //         subtotal: subtotal,
  //       },
  //       include: {
  //         cartProducts: true,
  //       },
  //     });

  //     return res.status(200).json(updatedCart);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(400).json(err);
  //   }
  // }

  async removeProduct(req: Request, res: Response) {
    try {
      const { productId, toppings } = req.body;
      const userId = req.currentUser?.id as string;

      const removedProduct = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          toppings: {
            include: {
              cartToProductToppings: true,
            },
          },
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
          cartProducts: true,
        },
      });

      let existingProduct: CartToProduct | undefined;

      existingProduct = cart?.cartProducts.find((item) => {
        return item.productId === productId;
      });

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      let toppingsPrice = 0;

      if (existingProduct && existingProduct?.quantity > 1) {
        for (const topping of toppings) {
          const selectedTopping = removedProduct.toppings.find((item) => {
            return item.id === topping.id;
          });
          if (selectedTopping) {
            const existingCartToProductTopping =
              await prisma.cartToProductTopping.findMany({
                where: {
                  cartToProdId: existingProduct.id,
                  toppingId: selectedTopping.id,
                },
              });

            if (existingCartToProductTopping.length > 0) {
              const cartToProductToppingToDelete =
                existingCartToProductTopping[0];

              await prisma.cartToProductTopping.delete({
                where: {
                  id: cartToProductToppingToDelete.id,
                },
              });

              toppingsPrice += selectedTopping.price * Number(topping.quantity);
            }
          }
        }

        await prisma.cartToProduct.update({
          where: {
            id: existingProduct.id,
            cartId: cart?.id,
          },
          data: {
            quantity: existingProduct.quantity - 1,
            price:
              existingProduct.price -
              Number(removedProduct.price) -
              toppingsPrice,
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
          cartProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      const subtotal = updatedddCart?.cartProducts.reduce(
        (total, cartProduct) => {
          return total + Number(cartProduct.price);
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
          cartProducts: {
            include: {
              product: true,
              cartToProductToppings: true,
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
          cartProducts: {
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
          cartProducts: {
            include: {
              product: true,
              cartToProductToppings: true,
            },
          },
        },
      });

      const productsInCart = await prisma.cartToProduct.findMany({
        where: {
          cartId: cart?.id,
        },
        include: {
          cartToProductToppings: true,
        },
      });

      const order = await prisma.order.create({
        data: {
          userId: userId as string,
          subTotal: Number(cart?.subtotal),
          total: 0,
          orderProducts: {
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

  async testingOrder(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;

      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          cartProducts: {
            include: {
              product: true,
              cartToProductToppings: true,
            },
          },
        },
      });

      const order = await prisma.order.create({
        data: {
          userId: userId as string,
          subTotal: Number(cart?.subtotal),
          total: 0,
        },
      });

      for (const cartProduct of cart?.cartProducts || []) {
        const toppings = cartProduct.cartToProductToppings.map((topping) => ({
          toppingId: topping.toppingId,
          quantity: topping.quantity,
        }));

        const orderProduct = await prisma.orderToProduct.create({
          data: {
            orderId: order.id,
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            price: cartProduct.price,
            orderToProductTopping: {
              create: toppings,
            },
          },
        });
      }

      const actualOrder = await prisma.order.findUnique({
        where: {
          id: order.id,
        },
      });

      return res.status(201).json(actualOrder);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
}
