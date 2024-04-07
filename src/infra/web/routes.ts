import { categoryRouter } from './product/routes/category.router'
import { productRouter } from './product/routes/product.router'
import { router } from './trpc'
import { userRouter } from './user/routes/user.router'

export const appRouter = router({
  user: userRouter,
  product: productRouter,
  category: categoryRouter,
})

export type AppRouter = typeof appRouter
