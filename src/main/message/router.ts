import fse from 'fs-extra'
import Router from '@koa/router'
import {
  sendNewImageMessageToMainWindow,
  sendNewTextMessageToMainWindow,
} from '../ipc'

const router = new Router()

router.get('/hello', (ctx) => {
  ctx.body = 'hello'
})

router.post('/message/text', async (ctx) => {
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
  await sendNewTextMessageToMainWindow(from, to, textMsg)
  ctx.status = 200
})

router.post('/message/image', async (ctx) => {
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
  const files = ctx.request.files
  const image = files?.image
  if (!image || Array.isArray(image)) {
    ctx.status = 400
    return
  }
  const mime = image.mimetype
  if (!mime) {
    ctx.status = 400
    return
  }
  // 保存图片到本地
  const ext = mime.split('/')[1]
  const imageDir = `./data/${to}/images`
  const imagePath = `${imageDir}/${image.newFilename}.${ext}`
  await fse.ensureDir(imageDir)
  await fse.rename(image.filepath, imagePath)
  // 发送图片信息到渲染进程
  const imageData = await fse.readFile(imagePath)
  await sendNewImageMessageToMainWindow(from, to, mime, imageData)
  // 响应
  ctx.status = 200
})

export default router
