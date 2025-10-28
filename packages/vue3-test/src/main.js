import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import TinySearchBox from '../../search-box/src/index.ts'
// import TinySearchBox from '../../search-box/dist/vue3/es/index.vue3.es.js'
// import { install, isVue2, isVue3 } from 'vue-demi';
// install(); // 强制启用 Vue 2 模式
// import '@discreted/vue-search-box/dist/index.css';
// import TinySearchBox, { zhCN, enUS } from './dist/es/index.es';
// import './dist/d/index.css';

// console.info('isVue2',isVue2, '================isVue3',isVue3)
console.info('TinySearchBox', TinySearchBox)

const app = createApp(App)
app.use(TinySearchBox)
console.info(TinySearchBox, app?.config?.globalProperties?.$t)

app.mount('#app')
