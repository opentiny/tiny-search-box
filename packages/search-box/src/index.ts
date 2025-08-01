import { App } from 'vue'
import { watch } from 'vue'
import TinySearchBox from './index.vue'
import TinySearchBoxFirstLevelPanel from './components/first-level-panel.vue'
import TinySearchBoxSecondLevelPanel from './components/second-level-panel.vue'
import zhCN from './utils/zh_CN'
import enUS from './utils/en_US'
import './index.less'
export * from './index.type'

let apps
TinySearchBox.install = function (app: App) {
  console.info('TinySearchBox.install', app)
  apps = app
  app.component(TinySearchBox.name, TinySearchBox)
}

export const t = (key, n1) => {
  console.info('TinySearchBox.App', apps)
  const array = key.split('.')
  return apps?.config?.globalProperties?.$t ? apps?.config?.globalProperties?.$t(key) : customTranslate(key, n1, 'zhCN')
}

function customTranslate(key: string, params?: Record<string, any>, lang: 'zhCN' | 'enUS' = 'zhCN') {
  console.info('customTranslate', key, params, lang)
  // 量国际化资源
  const resources = { zhCN, enUS }
  const i18nResources = resources[lang] || resources['zhCN']

  // 支持多层级 key
  const value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), i18nResources)

  let template = typeof value === 'string' ? value : key // key 不存在兜底

  if (params && typeof params === 'object') {
    Object.keys(params).forEach((k) => {
      // 变量名要和模板一致
      const value = params[k] ?? ''
      template = template.replaceAll(`{${k}}`, String(value))
    })
  }
  // 剩余未替换占位符兜底为空
  template = template.replace(/{{\s*\w+\s*}}/g, '')
  return template
}

export { zhCN, enUS, TinySearchBoxFirstLevelPanel, TinySearchBoxSecondLevelPanel }

export default TinySearchBox
