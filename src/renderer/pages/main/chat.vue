<script lang="ts" setup>
import FriendList from '~/components/FriendList.vue'
</script>

<template>
  <div h-full flex>
    <div w-54>
      <FriendList />
    </div>
    <div flex-grow overflow-auto>
      <RouterView />
    </div>
  </div>
</template>
