<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElInput } from 'element-plus'
import { login as loginApi } from '~/api/account'
import { failureHandler } from '~/utils/net'
import { useAccountStore } from '~/stores/account'

const router = useRouter()
const accountStore = useAccountStore()

const username = ref('')
const password = ref('')

async function login() {
  const res = await loginApi(username.value, password.value)
  if (!res.ok) {
    failureHandler('登录失败', res)
    return
  }
  const { token, account } = await res.json()
  accountStore.login(token, account)
  router.push('/')
  username.value = ''
  password.value = ''
}
</script>

<template>
  <div
    p-4
    text-center
    space-y-4
  >
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
    <div
      text-sm
      opacity-75
    >
      <RouterLink hover:text-blue to="/signup">
        注册
      </RouterLink>
    </div>
  </div>
</template>
