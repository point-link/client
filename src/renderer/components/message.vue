<script lang="ts" setup>
import type { Message } from '~/typings/app'

defineProps<{
  message: Message
  position: 'left' | 'right'
}>()
</script>

<template>
  <div
    flex
    :class="{
      'flex-row-reverse': position === 'right',
    }"
  >
    <div
      px-2 py-1 flex
      bg-gray-200 rounded
    >
      {{ message.data }}
    </div>
  </div>
</template>
