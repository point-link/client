<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  sessionStorage.removeItem('token')
  router.replace('/login')
}
</script>

<template>
  <div
    p-4
    text-center
    space-y-4
  >
    <h1>
      主页
    </h1>
    <ElButton @click="logout">
      退出登录
    </ElButton>
  </div>
</template>
