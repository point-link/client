<script lang="ts" setup>
import FriendList from '~/components/FriendList.vue'
</script>

<template>
  <div h-full flex>
    <div w-48>
      <FriendList />
    </div>
    <div flex-grow>
      <RouterView />
    </div>
  </div>
</template>
