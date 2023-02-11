<script lang="ts" setup>
import { ElButton, ElDatePicker, ElDivider, ElInput, ElOption, ElSelect } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useChatStore } from '~/stores/chat'
import { useAccountStore } from '~/stores/account'
import Message from '~/components/Message.vue'

const router = useRouter()
const chatStore = useChatStore()

const { selectedFriend, selectedMessages } = storeToRefs(chatStore)
const { uid } = storeToRefs(useAccountStore())

const messageContainer = ref<HTMLDivElement | null>(null)
const messageType = ref('')
const dateRange = ref<[Date, Date] | undefined>()
const keyword = ref('')

// 筛选
const filteredMessages = computed(() => {
  let messages = [...selectedMessages.value]
  if (messageType.value)
    messages = messages.filter(m => m.type === messageType.value)
  if (dateRange.value) {
    const start = dateRange.value[0]
    const end = dateRange.value[1]
    messages = messages.filter((m) => {
      return Number(start) <= m.timestamp && m.timestamp < (Number(end) + 3_600_000 * 24)
    })
  }
  if (keyword.value) {
    messages = messages.filter((m) => {
      switch (m.type) {
        case 'text':
          return m.data.includes(keyword.value)
        case 'image':
          return m.name.includes(keyword.value)
        case 'file':
          return m.name.includes(keyword.value)
        default:
          return false
      }
    })
  }
  return messages
})
</script>

<template>
  <div min-h-full p-4 space-y-4>
    <div space-y-2>
      <div>
        <ElButton @click="router.replace('/main/chat/chatroom')">
          返回
        </ElButton>
        <ElButton
          type="danger"
          plain
          @click="() => {
            if (!selectedFriend)
              return
            chatStore.clearMessages(selectedFriend.uid)
          }"
        >
          清空记录
        </ElButton>
      </div>
      <div flex space-x-2>
        <ElSelect v-model="messageType" placeholder="消息类型" clearable w-28>
          <ElOption label="文本" value="text" />
          <ElOption label="图片" value="image" />
          <ElOption label="文件" value="file" />
        </ElSelect>
        <ElDatePicker
          v-model="dateRange"
          type="daterange"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
        />
        <div w-48>
          <ElInput v-model="keyword" placeholder="关键词" clearable />
        </div>
      </div>
    </div>
    <ElDivider />
    <div
      v-if="filteredMessages.length > 0"
      ref="messageContainer"
      px-4 py-2 space-y-4 flex-grow overflow-y-auto
    >
      <Message
        v-for="msg, idx of filteredMessages" :key="idx"
        :message="msg"
        :position="msg.from === uid ? 'right' : 'left'"
      />
    </div>
    <div v-else text-center>
      暂无聊天记录
    </div>
  </div>
</template>
