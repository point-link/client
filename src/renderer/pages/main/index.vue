<script lang="ts" setup>
import Sidebar from '~/components/sidebar.vue'
</script>

<template>
  <div h-full flex>
    <div w-12>
      <Sidebar />
    </div>
    <div flex-grow overflow-auto>
      <RouterView />
    </div>
  </div>
</template>
