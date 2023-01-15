<script lang="ts" setup>
import Sidebar from '~/components/sidebar.vue'
import Contacts from '~/components/contacts.vue'
import Chatroom from '~/components/chatroom.vue'
</script>

<template>
  <div h-full flex>
    <div w-12>
      <Sidebar />
    </div>
    <div w-48>
      <Contacts />
    </div>
    <div flex-grow>
      <Chatroom />
    </div>
  </div>
</template>
