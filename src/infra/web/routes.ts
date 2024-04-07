import { productRouter } from './product/routes/product.router'
import { router } from './trpc'
import { userRouter } from './user/routes/user.router'

export const appRouter = router({
  user: userRouter,
  product: productRouter,
})

export type AppRouter = typeof appRouter
