import { App } from 'vue'
import TinySearchBox from './index.vue'
export { zhCN } from './utils/zh_CN'
export { enUS } from './utils/en_US'
import './index.less'

export * from './index.type'

TinySearchBox.install = function (app: App) {
  app.component(TinySearchBox.name, TinySearchBox)
}

export default TinySearchBox
