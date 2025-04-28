import express, {Express} from 'express'
import {Router} from 'express'

export async function createExpressApp() {
    const app = express()
    const router = Router()

    router.get('/', async (req, res) => {
        res.status(200).json({message: 'Hello world'})
    })

    app.use(express.json({limit: '100mb'}))

    app.use('/api', router)

    return app
}