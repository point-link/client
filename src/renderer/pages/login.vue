<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElInput } from 'element-plus'
import { login as loginApi } from '~/api/user'
import { failureHandler } from '~/utils/net'

const router = useRouter()

const username = ref('')
const password = ref('')

async function login() {
  const res = await loginApi(username.value, password.value)
  if (!res.ok) {
    failureHandler('登录失败', res)
    return
  }
  const { token } = await res.json()
  sessionStorage.setItem('token', token)
  router.push('/')
}
</script>

<template>
  <div p-4 text-center space-y-4>
    <ElInput
      v-model="username"
      placeholder="用户名"
    />
    <ElInput
      v-model="password"
      type="password"
      placeholder="密码"
      show-password
    />
    <ElButton @click="login">
      登录
    </ElButton>
  </div>
</template>
