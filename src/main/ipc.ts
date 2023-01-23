import os from 'node:os'
import { ipcMain } from 'electron'

import type { NetworkInterface, NetworkInterfaceInfo } from './typings/app'
import { getObservedIp } from './utils/net'
import { port } from './message/server'

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
  return port
})
