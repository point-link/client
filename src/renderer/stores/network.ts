import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NetworkInterface } from '~/typings/app'

export const useNetworkStore = defineStore('network', () => {
  const networkInterfaces = ref<NetworkInterface[]>([])
  const exposedIpv4 = ref<string | undefined>()

  async function refreshNetworkInfo() {
    networkInterfaces.value = await window.electron.getNetworkInterfaces()
    exposedIpv4.value = await window.electron.getExposedIpv4()
  }

  // 初始化
  refreshNetworkInfo()
  // 定时刷新（10s）
  setInterval(refreshNetworkInfo, 10000)

  return {
    networkInterfaces,
    exposedIpv4,
    refreshNetworkInfo,
  }
})
