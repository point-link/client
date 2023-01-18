import os from 'node:os'
import { ipcMain } from 'electron'
import type { NetworkInterface, NetworkInterfaceInfo } from './typings/app'
import { getExposedIp } from './utils/net'

ipcMain.handle('get-exposed-ip', async (event, family: 4 | 6) => {
  return await getExposedIp(family)
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
