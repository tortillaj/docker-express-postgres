import {createExpressApp} from './app'
import {Server} from "http";

const port = process.env.SERVER_PORT || 4000

let server: Server

async function start() {
    const app = await createExpressApp()

    server = app.listen({port}, () => console.log(`🚀 Server ready at http://localhost:${port}`))

    return server
}

function stop() {
    console.log(`shutting down server`)
    server.close()
}

export default {start, stop}