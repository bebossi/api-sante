import { z } from 'zod'
import { router } from '../../trpc'
import { adminProcedure, authorizedProcedure } from '@infra/web/auth.middleware'
import { ToppingController } from '../controllers/topping.controller'

const toppingController = new ToppingController()

export const toppingRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        productId: z.string(),
        image: z.string(),
        price: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const result = await toppingController.create(input as Required<typeof input>)
      return result
    }),
})
