import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'

const app = createApp(App);

app.use(router);
app.mount('#app');

// 开发者工具
window.addEventListener('keydown', (evt: KeyboardEvent) => {
  if (evt.code === 'F12') {
    window.electron.ipcRenderer.send('dev-tools', 'toggle');
  }
})
