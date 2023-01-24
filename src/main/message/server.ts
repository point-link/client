import Koa from 'koa'

const app = new Koa()

app.use((ctx) => {
  console.log(ctx.request)
  ctx.body = 'Hello'
})

function listen() {
  const errors: unknown[] = []
  for (let i = 0; i < 10; i++) {
    try {
      const port = 10000 + Math.floor(Math.random() * 55535)
      app.listen(port)
      return port
    }
    catch (err) {
      errors.push(err)
    }
  }
  console.error(errors)
  throw new Error('无法启动消息服务器')
}

export const port = listen()
