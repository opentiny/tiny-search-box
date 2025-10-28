/**
 * Copyright (c) 2022 - present TinyVue Authors.
 * Copyright (c) 2022 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */
import { $props, $prefix, $setup, defineComponent, isVue2, isVue3 } from '@opentiny/vue-common'
import { type PropType } from '@opentiny/vue-common'
// 临时绕过虚拟模板插件，直接导入Vue组件
import template from './index.vue'
import { t, setGlobalApp } from './utils/i18n'

export const searchBoxProps = {
  ...$props,
  tiny_mode: {
    type: String,
    default: 'pc'
  },
  /** 搜索框的值，支持v-model */
  modelValue: {
    type: Array,
    default: () => []
  },
  /** 搜索项配置数组 */
  items: {
    type: Array,
    default: () => []
  },
  /** 空状态时的占位符文本 */
  emptyPlaceholder: {
    type: String,
    default: ''
  },
  /** 潜在选项配置 */
  potentialOptions: {
    type: Object,
    default: () => null
  },
  /** 是否显示帮助按钮 */
  showHelp: {
    type: Boolean,
    default: true
  },
  /** ID映射键名 */
  idMapKey: {
    type: String,
    default: 'id'
  },
  /** 默认字段 */
  defaultField: {
    type: String,
    default: ''
  },
  /** 是否可编辑 */
  editable: {
    type: Boolean,
    default: false
  },
  /** 最大长度限制 */
  maxlength: {
    type: Number,
    default: undefined
  },
  /** 面板最大高度 */
  panelMaxHeight: {
    type: String,
    default: '999px'
  },
  /** 输入值分隔符 */
  splitInputValue: {
    type: String,
    default: ','
  },
  /** 自定义类名 */
  customClass: {
    type: String,
    default: ''
  },
  /** 自定义样式 */
  customStyle: {
    type: Object,
    default: () => ({})
  }
}
// console.info('isVue2', isVue2, 'isVue3', isVue3, '$props', $props, 'template', template)
// 组件安装函数
const TinySearchBox = defineComponent({
  name: $prefix + 'SearchBox',
  props: searchBoxProps,
  ...template
  // setup(props, context) {
  //   return $setup({ props, context, template })
  // }
})

// 安装插件
TinySearchBox.install = (app) => {
  // 设置全局应用实例，用于i18n
  setGlobalApp(app)

  // 注册组件
  app.component(TinySearchBox.name, TinySearchBox)
}

// 导出
export { TinySearchBox, t, setGlobalApp }
export * from './utils/i18n'
export * from './index.type'
export * from './utils/zh_CN'
export * from './utils/en_US'

export default TinySearchBox
