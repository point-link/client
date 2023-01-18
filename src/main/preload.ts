import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  async getExposedIpv4() {
    return await ipcRenderer.invoke('get-exposed-ipv4')
  },
  async getNetworkInterfaces() {
    return await ipcRenderer.invoke('get-network-interfaces')
  },
})
