<script lang="ts" setup>
import Sidebar from '~/components/sidebar.vue'
</script>

<template>
  <div h-full flex>
    <div w-12>
      <Sidebar />
    </div>
    <div flex-grow>
      <RouterView />
    </div>
  </div>
</template>
