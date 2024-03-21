import { router } from './trpc'
import { userRouter } from './user/routes/user.router'

export const appRouter = router({
  user: userRouter,
})

export type AppRouter = typeof appRouter
