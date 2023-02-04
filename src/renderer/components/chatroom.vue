<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { type Ref, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useChatStore } from '~/stores/chat'
import { useAccountStore } from '~/stores/account'
import { useFriendStore } from '~/stores/friend'
import { useNetworkStore } from '~/stores/network'
import { postImageMsg, postTextMsg } from '~/api/message'
import { DISPLAY_MODE_ENABLE } from '~/config'
import MessageComponent from '~/components/message.vue'

const messageContainer = ref<HTMLDivElement>() as Ref<HTMLDivElement>
const imageInput = ref<HTMLInputElement>() as Ref<HTMLInputElement>

const chatStore = useChatStore()
const { selectedFriend, selectedMessages } = storeToRefs(chatStore)
const { uid } = storeToRefs(useAccountStore())
const { friendOnlineClients } = storeToRefs(useFriendStore())
const { networkInfo } = storeToRefs(useNetworkStore())

const text = ref('')
const textMap = new Map<number, string>()

watch(text, (value) => {
  if (!selectedFriend.value)
    return
  textMap.set(selectedFriend.value.uid, value)
})
watch(selectedFriend, (friend) => {
  if (!friend)
    return
  text.value = textMap.get(friend.uid) || ''
})

async function sendText() {
  // 检查
  if (!uid.value || !text.value)
    return
  const friendUid = selectedFriend.value?.uid
  if (!friendUid)
    throw new Error('UID 为空')
  const client = friendOnlineClients.value[friendUid]
  if (!client) {
    ElMessage({ message: '好友不在线', type: 'warning', duration: 1500 })
    return
  }
  // 尝试发送消息
  let res: Response | undefined
  if (networkInfo.value.ipv6 && client.ipv6)
    res = await postTextMsg(`[${client.ipv6}]:${client.port}`, uid.value, friendUid, text.value)
  if (!res && networkInfo.value.ipv4 && client.ipv4)
    res = await postTextMsg(`${client.ipv4}:${client.port}`, uid.value, friendUid, text.value)
  if (!res && DISPLAY_MODE_ENABLE)
    res = await postTextMsg(`localhost:${client.port}`, uid.value, friendUid, text.value)
  if (!res) {
    ElMessage({ message: '无法进行 P2P 通信', type: 'warning', duration: 1500 })
    return
  }
  if (!res.ok)
    throw new Error(`发送文本消息失败，响应状态：${res.status}`)
  // 发送成功后
  chatStore.addNewMessage({
    type: 'text',
    from: uid.value!,
    to: friendUid,
    data: text.value,
  })
  text.value = ''
  await nextTick()
  messageContainer.value.scrollTo({ top: 1e9, behavior: 'smooth' })
}

async function sendImage(event: Event) {
  // 检查
  if (!uid.value)
    return
  const friendUid = selectedFriend.value?.uid
  if (!friendUid)
    throw new Error('UID 为空')
  const client = friendOnlineClients.value[friendUid]
  if (!client) {
    ElMessage({ message: '好友不在线', type: 'warning', duration: 1500 })
    return
  }
  const inputElement = event.target as HTMLInputElement
  const files = inputElement.files
  if (!files || files.length < 1)
    throw new Error('无法获取图片')
  const image = files[0]
  // 尝试发送消息
  let res: Response | undefined
  if (networkInfo.value.ipv6 && client.ipv6)
    res = await postImageMsg(`[${client.ipv6}]:${client.port}`, uid.value, friendUid, image)
  if (!res && networkInfo.value.ipv4 && client.ipv4)
    res = await postImageMsg(`${client.ipv4}:${client.port}`, uid.value, friendUid, image)
  if (!res && DISPLAY_MODE_ENABLE)
    res = await postImageMsg(`localhost:${client.port}`, uid.value, friendUid, image)
  if (!res) {
    ElMessage({ message: '无法进行 P2P 通信', type: 'warning', duration: 1500 })
    return
  }
  if (!res.ok)
    throw new Error(`发送文本消息失败，响应状态：${res.status}`)
  // 发送成功后
  chatStore.addNewMessage({
    type: 'image',
    from: uid.value,
    to: friendUid,
    mime: image.type,
    data: new Uint8Array(await image.arrayBuffer()),
  })
  imageInput.value.value = ''
  await nextTick()
  messageContainer.value.scrollTo({ top: 1e9, behavior: 'smooth' })
}
</script>

<template>
  <div w-full h-full flex flex-col>
    <template v-if="selectedFriend">
      <div px-4 py-2 text-lg border-b-1>
        {{ selectedFriend.profile?.nickname || selectedFriend.username }}
      </div>
      <div
        ref="messageContainer"
        px-4 py-2 space-y-4 flex-grow overflow-y-auto
      >
        <MessageComponent
          v-for="msg, idx of selectedMessages" :key="idx"
          :message="msg"
          :position="msg.from === uid ? 'right' : 'left'"
        />
      </div>
      <div border-t-1 flex flex-col>
        <div px-4 pt-2>
          <div
            i-carbon-image cursor-pointer transition
            opacity="65 hover:85"
            @click="imageInput.click()"
          >
            <input
              ref="imageInput"
              type="file" name="image" accept="image/*"
              w-0 h-0
              @change="sendImage"
            >
          </div>
        </div>
        <div px-4 py-2 flex-grow overflow-hidden>
          <textarea
            v-model="text"
            w-full h-full
            outline-none
            :rows="3"
            resize="none"
          />
        </div>
        <div px-4 pb-4 flex flex-row-reverse>
          <ElButton @click="sendText">
            发送
          </ElButton>
        </div>
      </div>
    </template>
  </div>
</template>
