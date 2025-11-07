import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import './style.css'
import TinySearchBox, { zhCN, enUS, setGlobalApp } from '@opentiny/vue-search-box'
import '@opentiny/vue-search-box-theme'

// 配置全局变量，用于 @opentiny/vue-common
// 根据 vite 配置的 process.env.TINY_MODE 动态设置（saas 模式时为 'saas'，否则为 'pc'）
Vue.prototype.$TINY_MODE = (typeof process !== 'undefined' && process.env && process.env.TINY_MODE) || 'pc'
Vue.prototype.$TINY_THEME = (typeof process !== 'undefined' && process.env && process.env.TINY_THEME) || 'tiny'

// 配置国际化
Vue.use(VueI18n)

// 全局混入，确保所有组件实例都有 tiny_mode 配置
Vue.mixin({
  provide() {
    return {
      tiny_mode: this.$TINY_MODE || 'pc',
      tiny_theme: this.$TINY_THEME || 'tiny'
    }
  }
})

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})


// 注册 TinySearchBox 组件
Vue.use(TinySearchBox)

// 设置全局 app 实例，让 search-box 能使用父级项目的 i18n
// 注意：Vue2 环境下，传递 i18n 实例而不是 Vue 构造函数
setGlobalApp({ $i18n: i18n })

const app = new Vue({
  i18n,
  render: (h) => h(App)
})

app.$mount('#app')
