import Koa from 'koa'
import cors from '@koa/cors'
import bodyparser from 'koa-bodyparser'
import router from './router'

const app = new Koa()

// middleware
app.use(cors())
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}))

// router
app.use(router.routes())
app.use(router.allowedMethods())

export default app
