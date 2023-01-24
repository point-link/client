import Router from '@koa/router'

const router = new Router()

router.get('/hello', (ctx) => {
  ctx.body = 'hello'
})

export default router
