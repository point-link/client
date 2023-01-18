<script lang="ts" setup>
import FriendList from '~/components/friend_list.vue'
import Chatroom from '~/components/chatroom.vue'
</script>

<template>
  <div min-h-full flex>
    <div w-48>
      <FriendList />
    </div>
    <div flex-grow>
      <Chatroom />
    </div>
  </div>
</template>
