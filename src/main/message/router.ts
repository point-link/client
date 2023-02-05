import fse from 'fs-extra'
import Router from '@koa/router'
import {
  sendNewFileMessageToMainWindow,
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
  await sendNewImageMessageToMainWindow(from, to, image.originalFilename, image.size, imageData, mime, width, height)
  // 响应
  ctx.status = 200
})

router.post('/message/file', async (ctx) => {
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
  await sendNewFileMessageToMainWindow(from, to, file.originalFilename, file.size)
  // 响应
  ctx.status = 200
})

export default router
