import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { middleware, publicProcedure } from './trpc'

const isLoggedMiddleware = middleware(async ({ ctx, next }) => {
  // console.log(ctx.token)
  if (!ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  try {
    const { sub } = jwt.verify(ctx.token, process.env.TOKEN_SIGN_SECRET as string)
    return next({
      ctx: { user_id: sub as string | undefined },
    })
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
})

const authorizedProcedure = publicProcedure.use(isLoggedMiddleware)

export { authorizedProcedure }
