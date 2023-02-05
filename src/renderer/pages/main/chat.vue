<script lang="ts" setup>
import FriendList from '~/components/FriendList.vue'
import Chatroom from '~/components/Chatroom/index.vue'
</script>

<template>
  <div h-full flex>
    <div w-48>
      <FriendList />
    </div>
    <div flex-grow h-full>
      <Chatroom />
    </div>
  </div>
</template>
