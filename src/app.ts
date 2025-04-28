import express, {Router} from 'express'

export async function createExpressApp() {
    // create router so we can create routes for our API
    const router = Router()

    // create a route that returns a simple JSON response
    router.get('/', async (req, res) => {
        res.status(200).json({message: 'Hello world'})
    })

    // create the express app
    const app = express()

    // set a larger size payload allotment
    app.use(express.json({limit: '100mb'}))

    // register the routes made above
    app.use('/api', router)

    return app
}