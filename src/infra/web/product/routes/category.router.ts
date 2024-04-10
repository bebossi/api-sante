import { z } from 'zod'
import { router } from '../../trpc'
import { adminProcedure } from '@infra/web/auth.middleware'
import { CategoryController } from '../controllers/category.controller'

const categoryController = new CategoryController()

export const categoryRouter = router({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const result = await categoryController.create(input as Required<typeof input>)
      return result
    }),
})
