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
  async setNewImageMessageHandler(handler: (from: number, to: number, mime: string, image: Uint8Array) => void) {
    ipcRenderer.on('new-image-message', (event, from, to, mime, image) => {
      handler(from, to, mime, image)
    })
  },
})
