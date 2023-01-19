<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ElCard } from 'element-plus'
import { useNetworkStore } from '~/stores/network'

const {
  networkInterfaces,
  exposedIpv4,
  exposedIpv6,
  isRealIpv4,
  isRealIpv6,
} = storeToRefs(useNetworkStore())
</script>

<template>
  <div min-h-full p-4 space-y-8>
    <ElCard header="可用的公网IP">
      <div space-y-1>
        <div>
          IPv4: {{ exposedIpv4 && isRealIpv4 ? exposedIpv4 : '无' }}
        </div>
        <div>
          IPv6: {{ exposedIpv6 && isRealIpv6 ? exposedIpv6 : '无' }}
        </div>
      </div>
    </ElCard>
    <ElCard header=" 本机网络接口">
      <div space-y-4>
        <div v-for="i of networkInterfaces" :key="i.name" space-y-1>
          <h2 font-bold>
            {{ i.name }}
          </h2>
          <div v-for="info of i.information" :key="info.address" text-sm>
            {{ info.address }}
          </div>
        </div>
      </div>
    </ElCard>
  </div>
</template>
