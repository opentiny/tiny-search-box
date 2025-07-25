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
  apps = app
  app.component(TinySearchBox.name, TinySearchBox)
}

export const t = (key) => {
  const array = key.split('.')
  return apps?.config?.globalProperties?.$t
    ? apps?.config?.globalProperties?.$t(key)
    : zhCN?.[array?.[0]]?.[array?.[1]]?.[array?.[2]]
}

export { zhCN, enUS, TinySearchBoxFirstLevelPanel, TinySearchBoxSecondLevelPanel }

export default TinySearchBox
