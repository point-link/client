import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  async getObservedIp(family: 4 | 6) {
    return await ipcRenderer.invoke('get-observed-ip', family)
  },
  async getNetworkInterfaces() {
    return await ipcRenderer.invoke('get-network-interfaces')
  },
  async getMessageServerPort() {
    return await ipcRenderer.invoke('get-message-server-port')
  },
  async setNewTextMessageHandler(handler: (from: number, to: number, textMsg: string) => void) {
    ipcRenderer.on('new-text-message', (event, from, to, textMsg) => {
      handler(from, to, textMsg)
    })
  },
})
