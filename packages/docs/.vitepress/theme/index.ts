import DefaultTheme from 'vitepress/theme'
import { NaiveUIContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css' // 导入 Font Awesome 图标
import '../../../search-box/src/index.less' // 导入搜索框样式
import './index.less'
export default {
  ...DefaultTheme,
  async enhanceApp({ app }) {
    if (!import.meta.env.SSR) {
      const Module = await import('../../../search-box/src/index.ts')
      app.use(Module.default)
    }
    app.component('demo-preview', NaiveUIContainer)
  }
}
