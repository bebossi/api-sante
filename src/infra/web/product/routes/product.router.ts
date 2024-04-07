import { ProductController } from '@infra/web/product/controllers/product.controller'
import { z } from 'zod'
import { router } from '../../trpc'
import { authorizedProcedure } from '@infra/web/auth.middleware'

const productController = new ProductController()

export const productRouter = router({
  create: authorizedProcedure
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
})
