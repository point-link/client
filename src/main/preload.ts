import { contextBridge, ipcRenderer } from 'electron'
import type { Message, RtcSignal } from './typings/app'

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
  setNewMessageHandler(handler: (message: Message) => void) {
    ipcRenderer.on('new-message', (event, message) => {
      handler(message)
    })
  },
  async pathExists(path: string) {
    return await ipcRenderer.invoke('path-exists', path)
  },
  showItemInfolder(path: string) {
    ipcRenderer.send('show-item-in-folder', path)
  },
  setRtcSignalHandler(handler: (signal: RtcSignal) => void) {
    ipcRenderer.on('rtc-signal', (event, signal) => {
      handler(signal)
    })
  },
})
