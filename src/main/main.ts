import { join } from 'path'
import { BrowserWindow, Menu, app, globalShortcut, session } from 'electron'
import './ipc'
import './message/server'

async function start() {
  await app.whenReady()

  // 主窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 800,
    minHeight: 500,
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

  // 开发者工具
  globalShortcut.register('Alt+D', () => {
    mainWindow.webContents.toggleDevTools()
  })

  // 监听退出事件
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit()
  })

  return mainWindow
}

export const mainWindowPromise = start()
