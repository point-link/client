import https from 'node:https'
import { API_BASE_PATH } from '../config'

export async function getExposedIp(family: 4 | 6) {
  return new Promise<string | undefined>((resolve) => {
    const req = https.request(`${API_BASE_PATH}/net/ip`, { family }, (res) => {
      res.on('data', (data) => {
        const { ip } = JSON.parse(data) as { ip: string }
        resolve(ip)
      })
    })
    req.on('error', () => {
      resolve(undefined)
    })
    req.end()
  })
}
