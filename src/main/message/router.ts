import fse from 'fs-extra'
import Router from '@koa/router'
import {
  sendNewMessageToMainWindow,
} from '../ipc'

const router = new Router()

router.get('/hello', (ctx) => {
  ctx.body = 'hello'
})

router.post('/message/text', async (ctx) => {
  // 获取参数
  const body = ctx.request.body
  const _from = body.from
  const from = Number(_from)
  if (typeof _from !== 'string' || isNaN(from)) {
    ctx.status = 400
    return
  }
  const _to = body.to
  const to = Number(_to)
  if (typeof _to !== 'string' || isNaN(to)) {
    ctx.status = 400
    return
  }
  const _timestamp = body.timestamp
  const timestamp = Number(_timestamp)
  if (typeof _timestamp !== 'string' || isNaN(timestamp)) {
    ctx.status = 400
    return
  }
  const text = body.text
  if (typeof text !== 'string') {
    ctx.status = 400
    return
  }
  // 响应
  await sendNewMessageToMainWindow({
    type: 'text', from, to, timestamp, data: text,
  })
  ctx.status = 200
})

router.post('/message/image', async (ctx) => {
  // 获取参数
  const body = ctx.request.body
  const _from = body.from
  const from = Number(_from)
  if (typeof _from !== 'string' || isNaN(from)) {
    ctx.status = 400
    return
  }
  const _to = body.to
  const to = Number(_to)
  if (typeof _to !== 'string' || isNaN(to)) {
    ctx.status = 400
    return
  }
  const _timestamp = body.timestamp
  const timestamp = Number(_timestamp)
  if (typeof _timestamp !== 'string' || isNaN(timestamp)) {
    ctx.status = 400
    return
  }
  const files = ctx.request.files
  const image = files?.image
  if (!image || Array.isArray(image)) {
    ctx.status = 400
    return
  }
  if (!image.originalFilename) {
    ctx.status = 400
    return
  }
  const mime = image.mimetype
  if (!mime) {
    ctx.status = 400
    return
  }
  const width = Number(ctx.request.body?.width)
  const height = Number(ctx.request.body?.height)
  if (!(width > 0 && height > 0)) {
    ctx.status = 400
    return
  }
  // 保存图片到数据目录
  const ext = mime.split('/')[1]
  const imageDir = `./data/${to}/images`
  const imagePath = `${imageDir}/${image.newFilename}.${ext}`
  await fse.ensureDir(imageDir)
  await fse.rename(image.filepath, imagePath)
  // 发送图片信息到渲染进程
  const imageData = await fse.readFile(imagePath)
  await sendNewMessageToMainWindow({
    type: 'image',
    from,
    to,
    timestamp,
    mime,
    width,
    height,
    name: image.originalFilename,
    size: image.size,
    data: imageData,
    localPath: imagePath,
  })
  // 响应
  ctx.status = 200
})

router.post('/message/file', async (ctx) => {
  // 获取参数
  const body = ctx.request.body
  const _from = body.from
  const from = Number(_from)
  if (typeof _from !== 'string' || isNaN(from)) {
    ctx.status = 400
    return
  }
  const _to = body.to
  const to = Number(_to)
  if (typeof _to !== 'string' || isNaN(to)) {
    ctx.status = 400
    return
  }
  const _timestamp = body.timestamp
  const timestamp = Number(_timestamp)
  if (typeof _timestamp !== 'string' || isNaN(timestamp)) {
    ctx.status = 400
    return
  }
  const files = ctx.request.files
  const file = files?.file
  if (!file || Array.isArray(file)) {
    ctx.status = 400
    return
  }
  if (!file.originalFilename) {
    ctx.status = 400
    return
  }
  // 保存文件到数据目录
  const fileDir = `./data/${to}/files`
  const filePath = `${fileDir}/${file.newFilename}_${file.originalFilename}`
  await fse.ensureDir(fileDir)
  await fse.rename(file.filepath, filePath)
  // 发送文件信息到渲染进程
  await sendNewMessageToMainWindow({
    type: 'file',
    from,
    to,
    timestamp,
    name: file.originalFilename,
    size: file.size,
    localPath: filePath,
  })
  // 响应
  ctx.status = 200
})

export default router
