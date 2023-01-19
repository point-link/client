import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  async getObservedIp(family: 4 | 6) {
    return await ipcRenderer.invoke('get-observed-ip', family)
  },
  async getNetworkInterfaces() {
    return await ipcRenderer.invoke('get-network-interfaces')
  },
})
