// import { PrismaClient } from "@prisma/client";
// import { Request, Response } from "express";

// const prisma = new PrismaClient();

// export class ProductController {
//   async createProduct(req: Request, res: Response) {
//     try {
//       const { name, description, price, categoryId, image } = req.body;

//       const product = await prisma.product.create({
//         data: {
//           name,
//           description,
//           price,
//           categoryId,
//           image,
//         },
//       });

//       return res.status(200).json(product);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async createCategory(req: Request, res: Response) {
//     try {
//       const { name } = req.body;

//       const category = await prisma.category.create({
//         data: {
//           name,
//         },
//       });

//       return res.status(200).json(category);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async createTopping(req: Request, res: Response) {
//     try {
//       const { name, description, price, image, productId } = req.body;

//       const topping = await prisma.topping.create({
//         data: {
//           name,
//           description,
//           price,
//           image,
//           productId: productId,
//         },
//       });

//       return res.status(200).json(topping);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async getProducts(req: Request, res: Response) {
//     try {
//       const products = await prisma.product.findMany({
//         include: {
//           toppings: true,
//           category: true,
//           cartProducts: true,
//           orderProducts: true,
//         },
//       });

//       return res.status(200).json(products);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async getCategories(req: Request, res: Response) {
//     try {
//       const categories = await prisma.category.findMany();
//       return res.status(200).json(categories);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async deleteProduct(req: Request, res: Response) {
//     try {
//       const { productId } = req.body;

//       const product = await prisma.product.delete({
//         where: {
//           id: productId,
//         },
//       });

//       return res.status(200).json(product);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async getProduct(req: Request, res: Response) {
//     try {
//       const { productId } = req.params;

//       const product = await prisma.product.findUnique({
//         where: {
//           id: productId,
//         },
//         include: {
//           toppings: true,
//         },
//       });

//       return res.status(200).json(product);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async updateProduct(req: Request, res: Response) {
//     try {
//       const { productId } = req.body;

//       const { name, image, description, price, categoryId } = req.body;

//       const updatedProduct = await prisma.product.update({
//         where: {
//           id: productId,
//         },
//         data: {
//           name: name,
//           description: description,
//           image: image,
//           price: price,
//           categoryId: categoryId,
//         },
//       });

//       return res.status(200).json(updatedProduct);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async getToppings(req: Request, res: Response) {
//     try {
//       const toppings = await prisma.topping.findMany({
//         include: {
//           product: true,
//         },
//       });

//       return res.status(200).json(toppings);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async getTopping(req: Request, res: Response) {
//     try {
//       const { toppingId } = req.params;

//       const topping = await prisma.topping.findUnique({
//         where: {
//           id: toppingId,
//         },
//         include: {
//           product: true,
//         },
//       });

//       return res.status(200).json(topping);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async getCategory(req: Request, res: Response) {
//     try {
//       const { categoryId } = req.params;

//       const category = await prisma.category.findUnique({
//         where: {
//           id: categoryId,
//         },
//       });

//       return res.status(200).json(category);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async deleteTopping(req: Request, res: Response) {
//     try {
//       const { toppingId } = req.body;

//       const topping = await prisma.topping.delete({
//         where: {
//           id: toppingId,
//         },
//       });

//       return res.status(200).json(topping);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }

//   async deleteCategory(req: Request, res: Response) {
//     try {
//       const { categoryId } = req.body;

//       const category = await prisma.category.delete({
//         where: {
//           id: categoryId,
//         },
//       });

//       return res.status(200).json(category);
//     } catch (err) {
//       console.log(err);
//       return res.status(400).json(err);
//     }
//   }
// }
