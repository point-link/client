<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { type Ref, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import MessageComponent from './Message.vue'
import type { Client } from '~/typings/app'
import { useChatStore } from '~/stores/chat'
import { useAccountStore } from '~/stores/account'
import { useFriendStore } from '~/stores/friend'
import { useNetworkStore } from '~/stores/network'
import { postFileMessage, postImageMessage, postTextMessage } from '~/api/message'
import { DISPLAY_MODE_ENABLE } from '~/config'

const messageContainer = ref<HTMLDivElement>() as Ref<HTMLDivElement>
const imageInput = ref<HTMLInputElement>() as Ref<HTMLInputElement>
const fileInput = ref<HTMLInputElement>() as Ref<HTMLInputElement>

const router = useRouter()
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
watch(selectedFriend, async (friend) => {
  if (!friend)
    return
  text.value = textMap.get(friend.uid) || ''
  await nextTick()
  messageContainer.value.scrollTo({ top: 1e12 })
})

chatStore.onAddNewMessage(async () => {
  await nextTick()
  messageContainer.value.scrollTo({ top: 1e12, behavior: 'smooth' })
})

function getHostAndPort(client: Client) {
  if (networkInfo.value.ipv6 && client.ipv6)
    return `[${client.ipv6}]:${client.port}`
  else if (networkInfo.value.ipv4 && client.ipv4)
    return `${client.ipv4}:${client.port}`
  else if (DISPLAY_MODE_ENABLE)
    return `localhost:${client.port}`
}

function getFriendClient() {
  const friendUid = selectedFriend.value?.uid
  if (!friendUid)
    throw new Error('好友 UID 为空值')
  return friendOnlineClients.value[friendUid]
}

async function getImageInfo(image: File) {
  const imgEl = new Image()
  imgEl.src = URL.createObjectURL(image)
  return new Promise<{ width: number; height: number }>((resolve) => {
    imgEl.onload = () => {
      resolve({ width: imgEl.width, height: imgEl.height })
      imgEl.src = ''
    }
  })
}

async function sendText() {
  // 检查
  if (!text.value)
    return
  if (!uid.value)
    throw new Error('当前 UID 为空值')
  // 获取好友客户端信息
  const client = getFriendClient()
  if (!client) {
    ElMessage({ message: '好友不在线', type: 'warning', duration: 1500 })
    return
  }
  // 尝试发送消息
  const hostAndPort = getHostAndPort(client)
  if (!hostAndPort) {
    ElMessage({ message: '无法进行 P2P 通信', type: 'warning', duration: 1500 })
    return
  }
  const timestamp = Date.now()
  const res = await postTextMessage(hostAndPort, uid.value, client.uid, timestamp, text.value)
  if (!res.ok)
    throw new Error(`发送文本消息失败，响应状态：${res.status}`)
  // 发送成功后
  chatStore.addNewMessage({
    type: 'text',
    from: uid.value!,
    to: client.uid,
    timestamp,
    data: text.value,
  })
  text.value = ''
}

async function sendImage(event: Event) {
  // 检查
  if (!uid.value)
    throw new Error('当前 UID 为空值')
  // 获取好友客户端信息
  const client = getFriendClient()
  if (!client) {
    ElMessage({ message: '好友不在线', type: 'warning', duration: 1500 })
    return
  }
  // 获取图片
  const inputElement = event.target as HTMLInputElement
  const files = inputElement.files
  if (!files || files.length < 1)
    throw new Error('无法获取图片')
  const image = files[0]
  const { width, height } = await getImageInfo(image)
  // 尝试发送消息
  const hostAndPort = getHostAndPort(client)
  if (!hostAndPort) {
    ElMessage({ message: '无法进行 P2P 通信', type: 'warning', duration: 1500 })
    return
  }
  const timestamp = Date.now()
  const res = await postImageMessage(hostAndPort, uid.value, client.uid, timestamp, image, width, height)
  if (!res.ok)
    throw new Error(`发送图片消息失败，响应状态：${res.status}`)
  // 发送成功后
  chatStore.addNewMessage({
    type: 'image',
    from: uid.value,
    to: client.uid,
    timestamp,
    mime: image.type,
    width,
    height,
    name: image.name,
    size: image.size,
    data: new Uint8Array(await image.arrayBuffer()),
  })
  imageInput.value.value = ''
}

async function sendFile(event: Event) {
  // 检查
  if (!uid.value)
    throw new Error('当前 UID 为空值')
  // 获取好友客户端信息
  const client = getFriendClient()
  if (!client) {
    ElMessage({ message: '好友不在线', type: 'warning', duration: 1500 })
    return
  }
  // 获取文件
  const inputElement = event.target as HTMLInputElement
  const files = inputElement.files
  if (!files || files.length < 1)
    throw new Error('无法获取文件')
  const file = files[0]
  // 尝试发送消息
  const hostAndPort = getHostAndPort(client)
  if (!hostAndPort) {
    ElMessage({ message: '无法进行 P2P 通信', type: 'warning', duration: 1500 })
    return
  }
  const timestamp = Date.now()
  const res = await postFileMessage(hostAndPort, uid.value, client.uid, timestamp, file)
  if (!res.ok)
    throw new Error(`发送文件消息失败，响应状态：${res.status}`)
  // 发送成功后
  chatStore.addNewMessage({
    type: 'file',
    from: uid.value,
    to: client.uid,
    timestamp,
    name: file.name,
    size: file.size,
  })
  fileInput.value.value = ''
}
</script>

<template>
  <div w-full h-full flex flex-col>
    <template v-if="selectedFriend">
      <div px-4 py-2 flex border-b-1>
        <div text-lg>
          {{ selectedFriend.remark || selectedFriend.profile.nickname || selectedFriend.username }}
        </div>
        <div flex-grow flex flex-row-reverse items-center>
          <button
            i-carbon-user-avatar text-lg i-carbon-image opacity="65 hover:85" transition
            @click="router.replace(`/main/chat/friend_detail/${selectedFriend?.uid}`)"
          />
        </div>
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
        <div px-4 pt-2 space-x-2>
          <button
            i-carbon-image opacity="65 hover:85" transition
            @click="imageInput.click()"
          >
            <input
              ref="imageInput"
              type="file" name="image" accept="image/*"
              w-0 h-0
              @change="sendImage"
            >
          </button>
          <button
            i-carbon-document-blank opacity="65 hover:85" transition
            @click="fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file" name="image"
              w-0 h-0
              @change="sendFile"
            >
          </button>
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
