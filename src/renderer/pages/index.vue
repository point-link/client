<script lang="ts" setup>
import { ElButton } from 'element-plus'

function onClick() {
  alert('Hi!')
}
</script>

<template>
  <div>
    Hello, MiiXinn!
    <ElButton @click="onClick">
      Hi!
    </ElButton>
  </div>
</template>
