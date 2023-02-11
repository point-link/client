import Koa from 'koa'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import router from './router'

const app = new Koa()

// middleware
app.use(cors())
app.use(koaBody({
  multipart: true,
  formLimit: 1024 * 1024 * 1024, // 1 GB
  jsonLimit: 1024 * 1024 * 10, // 10 MB
  textLimit: 1024 * 1024 * 10, // 10 MB
}))

// router
app.use(router.routes())
app.use(router.allowedMethods())

export default app
