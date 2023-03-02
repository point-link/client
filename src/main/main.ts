import { join } from 'path'
import { BrowserWindow, Menu, app, session } from 'electron'
import './ipc'
import './receiver/server'

async function start() {
  await app.whenReady()

  // 主窗口
  const mainWindow = new BrowserWindow({
    width: 920,
    height: 600,
    minWidth: 920,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // 渲染器入口
  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    mainWindow.loadURL(`http://localhost:${rendererPort}`)
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'))
  }

  // 不设置菜单栏
  Menu.setApplicationMenu(null)

  // session
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\''],
      },
    })
  })

  // 监听退出事件
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit()
  })

  return mainWindow
}

export const mainWindowPromise = start()
