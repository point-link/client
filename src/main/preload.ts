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
  setNewTextMessageHandler(handler: (from: number, to: number, textMsg: string) => void) {
    ipcRenderer.on('new-text-message', (event, from, to, textMsg) => {
      handler(from, to, textMsg)
    })
  },
  setNewImageMessageHandler(handler: (from: number, to: number, name: string, size: number, image: Uint8Array, mime: string, width: number, height: number, localPath?: string) => void) {
    ipcRenderer.on('new-image-message', (event, from, to, name, size, image, mime, width, height) => {
      handler(from, to, name, size, image, mime, width, height)
    })
  },
  setNewFileMessageHandler(handler: (from: number, to: number, name: string, size: number, localPath?: string) => void) {
    ipcRenderer.on('new-file-message', (event, from, to, name, size) => {
      handler(from, to, name, size)
    })
  },
  async pathExists(path: string) {
    return await ipcRenderer.invoke('path-exists', path)
  },
  showItemInfolder(path: string) {
    ipcRenderer.send('show-item-in-folder', path)
  },
})
