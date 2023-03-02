import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '~/router'
import App from '~/App.vue'

import 'element-plus/dist/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.mount('#app')

// 开发者工具
window.addEventListener('keydown', (event) => {
  if (event.code === 'F12')
    window.electron.toggleDevtools()
})
