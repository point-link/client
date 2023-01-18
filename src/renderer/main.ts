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

console.log(await window.electron.getExposedIpv4())
console.log(await window.electron.getNetworkInterfaces())
