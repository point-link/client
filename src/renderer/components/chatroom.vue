<script lang="ts" setup>
import { ElButton, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useChatStore } from '~/stores/chat'
import { useAccountStore } from '~/stores/account'
import { useFriendStore } from '~/stores/friend'
import { useNetworkStore } from '~/stores/network'
import { DISPLAY_MODE_ENABLE } from '~/config'

const text = ref('')
const { selectedFriend } = storeToRefs(useChatStore())
const { uid } = storeToRefs(useAccountStore())
const { friendOnlineClients } = storeToRefs(useFriendStore())
const { networkInfo } = storeToRefs(useNetworkStore())

async function postTextMsgApi(hostAndPort: string, to: number, textMsg: string) {
  return await fetch(`http://${hostAndPort}/message/text`, {
    method: 'POST',
    headers: {
      'x-from': `${uid.value}`,
      'x-to': `${to}`,
      'content-type': 'text/plain; charset=UTF-8',
    },
    body: textMsg,
  })
}

async function sendText() {
  const uid = selectedFriend.value?.uid
  if (!uid)
    throw new Error('UID 为空')
  const client = friendOnlineClients.value[uid]
  if (!client) {
    ElMessage({
      message: '好友不在线',
      type: 'warning',
      duration: 1500,
    })
    return
  }
  let res: Response | undefined
  if (networkInfo.value.ipv6 && client.ipv6)
    res = await postTextMsgApi(`[${client.ipv6}]:${client.port}`, client.uid, text.value)
  if (!res && networkInfo.value.ipv4 && client.ipv4)
    res = await postTextMsgApi(`${client.ipv4}:${client.port}`, client.uid, text.value)!
  if (!res && DISPLAY_MODE_ENABLE)
    res = await postTextMsgApi(`localhost:${client.port}`, client.uid, text.value)
  if (!res) {
    ElMessage({
      message: '无法进行 P2P 通信',
      type: 'warning',
      duration: 1500,
    })
    return
  }
  if (!res.ok)
    throw new Error(`发送文本消息失败，响应状态：${res.status}`)
  text.value = ''
}
</script>

<template>
  <div w-full h-full flex flex-col>
    <template v-if="selectedFriend">
      <div px-4 py-2 text-lg border-b-1>
        {{ selectedFriend.profile?.nickname || selectedFriend.username }}
      </div>
      <div px-4 py-2 flex-grow overflow-y-auto>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
        聊天<br>
      </div>
      <div border-t-1 flex flex-col>
        <div px-4 pt-4 pb-2 flex-grow overflow-hidden>
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
