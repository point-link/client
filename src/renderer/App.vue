<script lang="ts" setup>
import { useNetworkStore } from '~/stores/network'

// 进入 app 后立即加载 network store
useNetworkStore()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>
