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

  const observedIpv4 = ref<string | undefined>()
  const observedIpv6 = ref<string | undefined>()

  const isPublicIpv4 = computed(() => {
    if (!observedIpv4.value)
      return false
    return localIps.value.includes(observedIpv4.value)
  })
  const isPublicIpv6 = computed(() => {
    if (!observedIpv6.value)
      return false
    return localIps.value.includes(observedIpv6.value)
  })

  async function refreshNetworkInfo() {
    networkInterfaces.value = await window.electron.getNetworkInterfaces()
    observedIpv4.value = await window.electron.getObservedIp(4)
    observedIpv6.value = await window.electron.getObservedIp(6)
  }

  // 初始化
  refreshNetworkInfo()
  // 定时刷新（10s）
  setInterval(refreshNetworkInfo, 10000)

  return {
    networkInterfaces,
    localIps,
    observedIpv4,
    observedIpv6,
    isPublicIpv4,
    isPublicIpv6,
    refreshNetworkInfo,
  }
})
