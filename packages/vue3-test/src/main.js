import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import TinySearchBox, { zhCN, enUS, setGlobalApp } from '@opentiny/vue-search-box'
import '@opentiny/vue-search-box-theme'

// 配置国际化
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

const app = createApp(App)

// 使用 i18n
app.use(i18n)

// 使用 TinySearchBox
app.use(TinySearchBox)

// 设置全局 app 实例，让 search-box 能使用父级项目的 i18n
setGlobalApp(app)
app.mount('#app')
