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

  async function refreshNetworkInterfaces() {
    networkInterfaces.value = await window.electron.getNetworkInterfaces()
  }

  async function refreshObservedIp() {
    observedIpv4.value = await window.electron.getObservedIp(4)
    observedIpv6.value = await window.electron.getObservedIp(6)
  }

  // 初始化
  refreshNetworkInterfaces()
  refreshObservedIp()
  // 定时刷新接口数据
  let prevInterfaces = JSON.stringify(networkInterfaces.value)
  setInterval(async () => {
    await refreshNetworkInterfaces()
    const currentInterfaces = JSON.stringify(networkInterfaces.value)
    // 当接口变化时刷新 observedIp
    if (prevInterfaces !== currentInterfaces) {
      prevInterfaces = currentInterfaces
      await refreshObservedIp()
    }
  }, 5000)

  return {
    networkInterfaces,
    localIps,
    observedIpv4,
    observedIpv6,
    isPublicIpv4,
    isPublicIpv6,
    refreshNetworkInterfaces,
    refreshObservedIp,
  }
})
