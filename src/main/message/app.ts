import Koa from 'koa'
import cors from '@koa/cors'
import router from './router'

const app = new Koa()

// CORS
app.use(cors())

// router
app.use(router.routes())
app.use(router.allowedMethods())

export default app
