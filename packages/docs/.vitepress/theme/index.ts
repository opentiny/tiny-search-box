import DefaultTheme from 'vitepress/theme'
import { NaiveUIContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'
import './index.less'

export default {
  ...DefaultTheme,
  async enhanceApp({ app }) {
    if (!import.meta.env.SSR) {
      const [{ createI18n }, LocaleModule, SearchBoxModule] = await Promise.all([
        import('vue-i18n'),
        import('@opentiny/vue-locale'),
        import('@opentiny/vue-search-box')
      ])

      const locale = LocaleModule.default || LocaleModule
      const TinySearchBox = SearchBoxModule.default
      const { zhCN, enUS, setGlobalApp } = SearchBoxModule

      const messages = {
        'zh-CN': locale.extend(true, {}, locale.zhCN || {}, zhCN || {}),
        'en-US': locale.extend(true, {}, locale.enUS || {}, enUS || {})
      }

      const i18n = locale.initI18n({
        app,
        createI18n,
        messages,
        i18n: {
          legacy: false,
          locale: 'zh-CN',
          fallbackLocale: 'zh-CN'
        }
      })

      app.use(i18n)
      app.use(TinySearchBox)
    }
    app.component('demo-preview', NaiveUIContainer)
  }
}
