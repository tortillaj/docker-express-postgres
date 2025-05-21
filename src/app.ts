import express from 'express'
import { Router } from 'express'

export async function createExpressApp() {
  const router = Router()

  router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hello world' })
  })

  const app = express()

  app.use(express.json({ limit: '100mb' }))

  app.use('/api', router)

  return app
}
