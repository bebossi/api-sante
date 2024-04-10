import { ProductController } from '@infra/web/product/controllers/product.controller'
import { z } from 'zod'
import { publicProcedure, router } from '../../trpc'
import { adminProcedure, authorizedProcedure } from '@infra/web/auth.middleware'
import { TRPCError } from '@trpc/server'

const productController = new ProductController()

export const productRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        categoryId: z.string(),
        image: z.string(),
        price: z.number(),
        toppings: z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            image: z.string(),
            productId: z.string(),
          })
          .array(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const result = await productController.create(input as Required<typeof input>)
      return result
    }),
  getProducts: publicProcedure.query(async () => {
    const products = await productController.getProducts()
    return products
  }),
  getProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { productId } = input
      if (!productId) throw new TRPCError({ code: 'BAD_REQUEST' })
      const result = await productController.getProduct({ productId })
      return result
    }),
})
