import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  async getExposedIp(family: 4 | 6) {
    return await ipcRenderer.invoke('get-exposed-ip', family)
  },
  async getNetworkInterfaces() {
    return await ipcRenderer.invoke('get-network-interfaces')
  },
})
