import os from 'node:os'
import { ipcMain } from 'electron'
import { getExposedIp } from './utils/net'

ipcMain.handle('get-exposed-ipv4', async () => {
  return await getExposedIp(4)
})

ipcMain.handle('get-network-interfaces', () => {
  const interfaces = os.networkInterfaces()
  const result: { name: string; information: { address: string; family: 'IPv4' | 'IPv6' }[] }[] = []
  for (const name of Object.keys(interfaces)) {
    const information = interfaces[name]!
      .filter(i => !i.internal)
      .map(i => ({
        address: i.address,
        family: i.family,
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
