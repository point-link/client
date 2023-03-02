import os from 'node:os'
import { resolve } from 'node:path'
import { pathExists } from 'fs-extra'
import { ipcMain, shell } from 'electron'

import type { Message, NetworkInterface, NetworkInterfaceInfo, RtcSignal } from './typings/app'
import { mainWindowPromise } from './main'
import { getObservedIp } from './utils/net'
import { MESSAGE_SERVER_PORT } from './receiver/server'

ipcMain.handle('get-observed-ip', async (event, family: 4 | 6) => {
  return await getObservedIp(family)
})

ipcMain.handle('get-network-interfaces', () => {
  const interfaces = os.networkInterfaces()
  const result: NetworkInterface[] = []
  for (const name of Object.keys(interfaces)) {
    const information = interfaces[name]!
      .filter(i => !i.internal)
      .map<NetworkInterfaceInfo>(i => ({
        address: i.address,
        family: i.family === 'IPv4' ? 4 : 6,
      }))
    if (information.length === 0)
      continue
    result.push({
      name,
      information,
    })
  }
  return result
})

ipcMain.handle('get-message-server-port', () => {
  return MESSAGE_SERVER_PORT
})

ipcMain.handle('path-exists', async (event, path: string) => {
  return await pathExists(path)
})

ipcMain.on('show-item-in-folder', (event, path: string) => {
  shell.showItemInFolder(resolve(path))
})

ipcMain.on('toggle-devtools', async () => {
  const mainWindow = await mainWindowPromise
  mainWindow.webContents.toggleDevTools()
})

export async function sendNewMessageToMainWindow(message: Message) {
  const mainWindow = await mainWindowPromise
  mainWindow.webContents.send('new-message', message)
}

export async function sendRtcSignalToMainWindow(signal: RtcSignal) {
  const mainWindow = await mainWindowPromise
  mainWindow.webContents.send('rtc-signal', signal)
}
