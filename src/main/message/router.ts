import Router from '@koa/router'

const router = new Router()

router.get('/hello', (ctx) => {
  ctx.body = 'hello'
})

router.post('/message/text', (ctx) => {
  // 获取参数
  const _from = ctx.headers['x-from']
  const from = Number(_from)
  if (typeof _from !== 'string' || isNaN(from)) {
    ctx.status = 400
    return
  }
  const _to = ctx.headers['x-to']
  const to = Number(_to)
  if (typeof _to !== 'string' || isNaN(to)) {
    ctx.status = 400
    return
  }
  const textMsg = ctx.request.body
  if (typeof textMsg !== 'string') {
    ctx.status = 400
    return
  }
  // 响应
  ctx.status = 200
})

export default router
