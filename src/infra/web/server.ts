import 'reflect-metadata'
import dotenv from 'dotenv'
import express from 'express'
import '../../infra/container'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import { appRouter } from './routes'
import { createContext } from './trpc'

const runApp = async () => {
  dotenv.config()

  const app = express()

  app.use(cors())
  app.disable('x-powered-by')
  app.use(express.json())
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: (trpc) => console.error(trpc.error),
    })
  )

  const port: number = Number(process.env.PORT) || 3000

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
}

runApp()
