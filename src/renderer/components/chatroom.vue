<script lang="ts" setup>
import { ElButton, ElInput } from 'element-plus'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '~/stores/chat'

const text = ref('')
const { selectedFriend } = storeToRefs(useChatStore())
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
          <ElButton>
            发送
          </ElButton>
        </div>
      </div>
    </template>
  </div>
</template>
