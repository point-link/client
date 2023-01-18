<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { ElCard } from 'element-plus'
import { useNetworkStore } from '~/stores/network'

const networkStore = useNetworkStore()

const { exposedIpv4, networkInterfaces } = storeToRefs(networkStore)
const ips = computed(() => {
  const arr: string[] = []
  for (const i of networkInterfaces.value)
    arr.push(...i.information.map(info => info.address))
  return arr
})
const isRealIpv4 = computed(() => {
  if (!exposedIpv4.value)
    return false
  return ips.value.includes(exposedIpv4.value)
})
</script>

<template>
  <div w-full h-full p-4 space-y-8>
    <ElCard header="外部的IPv4">
      <template v-if="exposedIpv4">
        {{ exposedIpv4 }}{{ isRealIpv4 ? '' : ' （非本地IP）' }}
      </template>
      <template v-else>
        无
      </template>
    </ElCard>
    <ElCard header=" 本地网络接口">
      <div space-y-4>
        <div v-for="i of networkInterfaces" :key="i.name" space-y-1>
          <h2>
            接口名：{{ i.name }}
          </h2>
          <div v-for="info of i.information" :key="info.address" text-sm>
            {{ info.address }}
          </div>
        </div>
      </div>
    </ElCard>
  </div>
</template>
