import { z } from 'zod'
import { publicProcedure, router } from '../../trpc'
import { UserController } from '../controllers/user.controller'

const userController = new UserController()

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        role: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const result = await userController.create(input as Required<typeof input>)
      return result
    }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts
      const tokenOrErrorMessage = await userController.login(
        input as Required<typeof input>
      )
      console.log('route', tokenOrErrorMessage)
      return tokenOrErrorMessage
    }),
})
