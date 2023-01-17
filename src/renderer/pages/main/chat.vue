<script lang="ts" setup>
import Contacts from '~/components/contacts.vue'
import Chatroom from '~/components/chatroom.vue'
</script>

<template>
  <div h-full w-full flex>
    <div w-48>
      <Contacts />
    </div>
    <div flex-grow>
      <Chatroom />
    </div>
  </div>
</template>
