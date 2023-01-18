import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NetworkInterface } from '~/typings/app'

export const useNetworkStore = defineStore('network', () => {
  const networkInterfaces = ref<NetworkInterface[]>([])
  const localIps = computed(() => {
    const arr: string[] = []
    for (const i of networkInterfaces.value)
      arr.push(...i.information.map(info => info.address))
    return arr
  })

  const exposedIpv4 = ref<string | undefined>()
  const exposedIpv6 = ref<string | undefined>()

  const isRealIpv4 = computed(() => {
    if (!exposedIpv4.value)
      return false
    return localIps.value.includes(exposedIpv4.value)
  })
  const isRealIpv6 = computed(() => {
    if (!exposedIpv6.value)
      return false
    return localIps.value.includes(exposedIpv6.value)
  })

  async function refreshNetworkInfo() {
    networkInterfaces.value = await window.electron.getNetworkInterfaces()
    exposedIpv4.value = await window.electron.getExposedIp(4)
    exposedIpv6.value = await window.electron.getExposedIp(6)
  }

  // 初始化
  refreshNetworkInfo()
  // 定时刷新（10s）
  setInterval(refreshNetworkInfo, 10000)

  return {
    networkInterfaces,
    localIps,
    exposedIpv4,
    exposedIpv6,
    isRealIpv4,
    isRealIpv6,
    refreshNetworkInfo,
  }
})
