import { z } from 'zod'
import { publicProcedure, router } from '../../trpc'
import { UserController } from '../controllers/user.controller'
import { authorizedProcedure } from '@infra/web/auth.middleware'
import { TRPCError } from '@trpc/server'

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
      return tokenOrErrorMessage
    }),
  getUserData: authorizedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      const { user_id: loggedUserId } = ctx
      if (!loggedUserId) throw new TRPCError({ code: 'UNAUTHORIZED' })
      const { userId } = input
      const result = await userController.getUserData({ userId: userId ?? loggedUserId })
      return result
    }),
})
