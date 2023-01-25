<script lang="ts" setup>
import { ElButton, ElInput } from 'element-plus'
import { ref } from 'vue'

const text = ref('')
</script>

<template>
  <div w-full h-full flex flex-col>
    <div flex-grow overflow-y-auto>
      聊天
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
  </div>
</template>
