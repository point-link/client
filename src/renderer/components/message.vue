<script lang="ts" setup>
import type { Message } from '~/typings/app'

defineProps<{
  message: Message
  position: 'left' | 'right'
}>()

function createImageUrl(mime: string, image: Uint8Array) {
  return URL.createObjectURL(new Blob([image], { type: mime }))
}
</script>

<template>
  <div
    flex
    :class="{
      'flex-row-reverse': position === 'right',
    }"
  >
    <div
      p-2 flex
      bg-gray-200 rounded
    >
      <div v-if="message.type === 'text'">
        {{ message.data }}
      </div>
      <div v-if="message.type === 'image'">
        <img :src="createImageUrl(message.mime, message.data)" alt="image">
      </div>
    </div>
  </div>
</template>
