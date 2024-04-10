import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { middleware, publicProcedure } from './trpc'

const isLoggedMiddleware = middleware(async ({ ctx, next }) => {
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

const isAdminMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  try {
    const decoded = jwt.verify(ctx.token, process.env.TOKEN_SIGN_SECRET as string)

    if (typeof decoded === 'object' && decoded && 'id' in decoded && 'role' in decoded) {
      const { id, role } = decoded

      if (role !== 'admin') {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return next({
        ctx: { user_id: id as string },
      })
    } else {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
})

const authorizedProcedure = publicProcedure.use(isLoggedMiddleware)
const adminProcedure = publicProcedure.use(isAdminMiddleware)

export { authorizedProcedure, adminProcedure }
