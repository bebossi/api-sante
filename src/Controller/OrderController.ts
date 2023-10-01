import { CartToProduct, Order, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../libs/stripe";

const prisma = new PrismaClient();

export class OrderController {
  async addProduct(req: Request, res: Response) {
    try {
      const { productId, toppings, quantity } = req.body;
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
        return res.status(404).json("Product is required");
      }

      const cartToProduct = await prisma.cartToProduct.create({
        data: {
          cartId: cart?.id as string,
          productId: productId,
          quantity: quantity,
          price: Number(addProduct?.price),
        },
      });

      let toppingsPrice = 0;

      for (const topping of toppings) {
        const selectedTopping = addProduct.toppings.find(
          (item) => item.id === topping.topping.id
        );

        if (selectedTopping) {
          await prisma.cartToProductTopping.create({
            data: {
              toppingId: selectedTopping.id,
              cartToProdId: cartToProduct.id,
              quantity: Number(topping.quantity) * cartToProduct.quantity,
            },
          });
          toppingsPrice +=
            selectedTopping.price *
            Number(topping.quantity) *
            cartToProduct.quantity;
        }
      }

      await prisma.cartToProduct.update({
        where: {
          id: cartToProduct.id,
        },
        data: {
          price: Number(addProduct.price) * quantity + Number(toppingsPrice),
        },
      });
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
              id: cartToProduct.id,
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

  async removeProduct(req: Request, res: Response) {
    try {
      const { productId, cartProductId } = req.body;
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

      const cartToProduct = await prisma.cartToProduct.delete({
        where: {
          cartId: cart?.id,
          id: cartProductId,
          productId: productId,
        },
      });

      const updatedCart = await prisma.cart.update({
        where: {
          userId: userId,
          id: cart?.id,
        },
        data: {
          subtotal: Number(cart?.subtotal) - cartToProduct.price,
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

  async testingOrder(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;
      const { addressId, avaliableAppointmentId } = req.body;

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

      if (
        (avaliableAppointmentId && addressId) ||
        (!avaliableAppointmentId && !addressId)
      ) {
        return res.status(500).json("error");
      }

      const order = await prisma.order.create({
        data: {
          avaliableAppointmentId: avaliableAppointmentId || undefined,
          addressId: addressId || undefined,
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
            orderId: order.id as string,
            productId: cartProduct.productId as string,
            quantity: cartProduct.quantity as number,
            price: cartProduct.price as number,
            orderToProductTopping: {
              create: toppings,
            },
          },
        });
      }

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      const actualOrder = await prisma.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          address: true,
          orderProducts: {
            include: {
              product: true,
              orderToProductTopping: true,
            },
          },
        },
      });

      actualOrder?.orderProducts.forEach((orderProduct) => {
        line_items.push({
          quantity: orderProduct.quantity,
          price_data: {
            currency: "BRL",
            product_data: {
              name: orderProduct.product.name,
            },
            unit_amount: (orderProduct.price * 100) / orderProduct.quantity,
          },
        });
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "auto",
        client_reference_id: actualOrder?.userId,
        success_url: `${process.env.FRONTEND_URL}/menu?success=1`,
        cancel_url: `${process.env.FRONTEND_URL}/menu?canceled=1`,
        metadata: {
          orderId: order.id,
        },
      });

      await prisma.cart.update({
        where: {
          id: cart?.id,
        },
        data: {
          subtotal: 0,
        },
      });

      await prisma.cartToProduct.deleteMany({
        where: {
          cartId: cart?.id,
        },
      });

      return res.status(201).json({ url: session.url });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        err,
        message: "An error occurred while processing your order.",
      });
    }
  }

  async confirmOrder(req: Request, res: Response) {
    const body = req.body;
    const signature = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    const payloadString = JSON.stringify(body);

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK! as string
      );
    } catch (err: any) {
      console.log(err);
      return res.status(400).json(`Web hook Error: ${err}`);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const order = await prisma.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          status: "Pagamento confirmado",
        },
        include: {
          orderProducts: true,
        },
      });
    }
    return res.status(200).json({ recived: true });
  }
  async getCart(req: Request, res: Response) {
    const userId = req.currentUser?.id;

    try {
      const cart = await prisma.cart.findUnique({
        where: {
          userId: userId,
        },
        include: {
          cartProducts: {
            include: {
              product: true,
              cartToProductToppings: {
                include: {
                  topping: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        await prisma.cart.create({
          data: {
            userId: userId,
            subtotal: 0,
          },
          include: {
            cartProducts: {
              include: {
                product: true,
                cartToProductToppings: {
                  include: {
                    topping: true,
                  },
                },
              },
            },
          },
        });
      }

      return res.status(200).json(cart);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async filterOrders(req: Request, res: Response) {
    try {
      const { isPaid, status, avaliableAppointment } = req.query;
      let query: any = {};

      if (isPaid) {
        query.isPaid = isPaid === "true";
      }
      if (status) query.status = status;
      if (avaliableAppointment)
        query.avaliableAppointment = avaliableAppointment;

      const orders = await prisma.order.findMany({
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(orders);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          address: true,
          orderProducts: {
            include: {
              product: true,
              orderToProductTopping: {
                include: {
                  topping: true,
                  orderToProduct: true,
                },
              },
            },
          },
          user: true,
          avaliableAppointment: true,
        },
      });

      return res.status(200).json(order);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getOrdersByClient(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;
      const { isPaid, status, avaliableAppointment } = req.query;
      const filters: any = {
        userId: userId,
      };

      if (isPaid) {
        filters.isPaid = isPaid === "true";
      }
      if (status) filters.status = status;
      if (avaliableAppointment)
        filters.avaliableAppointment = avaliableAppointment;

      const orders = await prisma.order.findMany({
        where: filters,
      });

      return res.status(200).json(orders);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getOrderByClient(req: Request, res: Response) {
    try {
      const userId = req.currentUser?.id;
      const { orderId } = req.params;

      const order = await prisma.order.findUnique({
        where: {
          userId: userId,
          id: orderId,
        },
        include: {
          address: true,
          orderProducts: {
            include: {
              product: true,
              orderToProductTopping: {
                include: {
                  topping: true,
                  orderToProduct: true,
                },
              },
            },
          },
          user: true,
          avaliableAppointment: true,
        },
      });

      return res.status(200).json(order);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async statusOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: status,
        },
      });

      return res.status(200).json(order);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getTotalRevenue(req: Request, res: Response) {
    try {
      const paidOrders = await prisma.order.findMany({
        where: {
          isPaid: true,
        },
        include: {
          orderProducts: {
            include: {
              product: true,
              orderToProductTopping: true,
            },
          },
        },
      });

      const salesCount = paidOrders.length;

      const totalRevenue = paidOrders.reduce((total, order) => {
        return (total += order.subTotal);
      }, 0);

      return res.status(200).json({ totalRevenue, salesCount });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getGraphRevenue(req: Request, res: Response) {
    try {
      const paidOrders = await prisma.order.findMany({
        where: {
          isPaid: true,
        },
        include: {
          orderProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      const monthlyRevenue: { [key: number]: number } = {};

      for (const order of paidOrders) {
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;

        for (const product of order.orderProducts) {
          revenueForOrder += product.product.price.toNumber();
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
      }

      interface GraphData {
        name: string;
        total: number;
      }
      const graphData: GraphData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
      ];

      for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
      }

      return res.status(200).json(graphData);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
}
