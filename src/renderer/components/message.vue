<script lang="ts" setup>
import type { Message } from '~/typings/app'

defineProps<{
  message: Message
  position: 'left' | 'right'
}>()

function createImageUrl(mime: string, image: Uint8Array) {
  return URL.createObjectURL(new Blob([image], { type: mime }))
}

function friendlySize(byteCount: number) {
  if (byteCount < 1024)
    return `${byteCount} B`
  const k = byteCount / 1024
  if (k < 1024)
    return `${k.toFixed(2)} KB`
  const m = k / 1024
  if (m < 1024)
    return `${m.toFixed(2)} MB`
  const g = m / 1024
  if (g < 1024)
    return `${g.toFixed(2)} KB`
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
      <div v-if="message.type === 'text'" max-w-96>
        {{ message.data }}
      </div>
      <div v-if="message.type === 'image'" max-w-72>
        <img
          :src="createImageUrl(message.mime, message.data)"
          :alt="message.name" :width="message.width" :height="message.height"
        >
      </div>
      <div v-if="message.type === 'file'" max-w-96 space-y-2>
        <div flex space-x-2>
          <div space-y-1>
            <div>
              {{ message.name }}
            </div>
            <div text-sm opacity-75>
              {{ friendlySize(message.size) }}
            </div>
          </div>
          <div flex justify-center items-center>
            <div i-carbon-document-blank text-2xl opacity-75 />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
