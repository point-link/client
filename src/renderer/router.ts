import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '~/stores/account'
import Login from '~/pages/login.vue'
import Signup from '~/pages/signup.vue'
import Main from '~/pages/main/index.vue'
import Chat from '~/pages/main/chat.vue'
import FriendRequest from '~/pages/main/friend_request.vue'
import FriendRequestNew from '~/pages/main/friend_request_new.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/main/chat',
  },
  {
    path: '/main',
    component: Main,
    redirect: '/main/chat',
    children: [
      {
        path: 'chat',
        component: Chat,
      },
      {
        path: 'friend_request',
        component: FriendRequest,
      },
      {
        path: 'friend_request_new',
        component: FriendRequestNew,
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/signup',
    component: Signup,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore()
  // 检查是否登录
  if (to.path === '/login' || to.path === '/signup' || accountStore.loggedIn)
    next()
  else
    next('/login')
})

export default router
