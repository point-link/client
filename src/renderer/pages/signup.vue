<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElInput } from 'element-plus'
import { signup as signupApi } from '~/api/account'
import { failureHandler, successHandler } from '~/utils/net'

const router = useRouter()

const username = ref('')
const password = ref('')

async function signup() {
  const res = await signupApi(username.value, password.value)
  if (!res.ok) {
    failureHandler('注册失败', res)
    return
  }
  successHandler('注册成功')
  router.replace('/login')
  username.value = ''
  password.value = ''
}
</script>

<template>
  <div
    p-12 flex flex-col items-center
    space-y-4
  >
    <h1 text-xl font-bold>
      注册账号
    </h1>
    <div w-64>
      <ElInput
        v-model="username"
        placeholder="用户名"
      />
    </div>
    <div w-64>
      <ElInput
        v-model="password"
        type="password"
        placeholder="密码"
        show-password
      />
    </div>
    <div>
      <ElButton @click="router.replace('/login')">
        取消
      </ElButton>
      <ElButton @click="signup">
        注册
      </ElButton>
    </div>
  </div>
</template>
