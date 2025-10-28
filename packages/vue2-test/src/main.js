import Vue from 'vue'
import App from './App.vue'
// import VueCompositionAPI from '@vue/composition-api'

// Vue.use(VueCompositionAPI)


// 注册 composition-api（在任何组件导入前）

// 全局事件总线，确保所有第三方组件实例都能拿到 $emitter
// const bus = new Vue()
// Vue.prototype.$emitter = bus
// Vue.prototype.$onEmitter = (...args) => bus.$on(...args)
// Vue.prototype.$offEmitter = (...args) => bus.$off(...args)

// // 添加 OpenTiny 组件需要的全局配置
// Vue.prototype.$TINY_MODE = 'saas'
// Vue.prototype.$TINY_THEME = 'tiny'

// // 额外兜底：给每个组件实例在 beforeCreate 阶段补上 this.$emitter
// Vue.mixin({
//   beforeCreate() {
//     if (!this.$emitter) this.$emitter = Vue.prototype.$emitter
//     if (!this.$TINY_MODE) this.$TINY_MODE = Vue.prototype.$TINY_MODE
//     if (!this.$TINY_THEME) this.$TINY_THEME = Vue.prototype.$TINY_THEME
//   }
// })

import './assets/main.css'

// 导入Vue2版本的TinySearchBox组件
// import TinySearchBox from '../../search-box/src/index.vue'

// console.info('Vue2 test loaded:', TinySearchBox)

// // 注册组件
// Vue.component('TinySearchBox', TinySearchBox)

const app = new Vue({
  render: (h) => h(App)
})

app.$mount('#app')
