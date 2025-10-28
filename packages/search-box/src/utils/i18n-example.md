/**
 * i18n工具使用示例
 * 
 * 1. 如果项目有i18n配置，组件会自动使用项目的i18n
 * 2. 如果项目没有i18n配置，组件会使用默认的中文语言包
 * 3. 支持动态切换语言
 */

// 示例1: 在Vue项目中使用
import { createApp } from 'vue'
import TinySearchBox from '@discreted/vue-search-box'
import { setGlobalApp } from '@discreted/vue-search-box'

const app = createApp({
  // 你的应用组件
})

// 方式1: 使用组件库的install方法（推荐）
app.use(TinySearchBox)

// 方式2: 手动设置全局应用实例
// setGlobalApp(app)

// 示例2: 在Vue2项目中使用
import Vue from 'vue'
import TinySearchBox from '@discreted/vue-search-box'

Vue.use(TinySearchBox)

// 示例3: 如果项目有i18n配置
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      tvp: {
        tvpSearchbox: {
          initUse: 'Use "{value}"',
          attributeType: 'Attribute Type',
          propertyValue: 'Property Value of {type}',
          matched: 'Matched',
          minValue: 'Min Value',
          maxValue: 'Max Value',
          startDate: 'Start Date',
          endDate: 'End Date',
          startDateTime: 'Start DateTime',
          endDateTime: 'End DateTime',
          pleaseSelect: 'Please Select',
          customValue: 'Custom Value',
          selectAll: 'Select All',
          confirm: 'Confirm'
        }
      }
    },
    'zh-CN': {
      tvp: {
        tvpSearchbox: {
          initUse: '使用"{value}"',
          attributeType: '属性类型',
          propertyValue: '{type}的属性值',
          matched: '匹配项',
          minValue: '最小值',
          maxValue: '最大值',
          startDate: '开始日期',
          endDate: '结束日期',
          startDateTime: '开始时间',
          endDateTime: '结束时间',
          pleaseSelect: '请选择',
          customValue: '自定义值',
          selectAll: '全选',
          confirm: '确认'
        }
      }
    }
  }
})

const app = createApp({
  // 你的应用组件
})

app.use(i18n)
app.use(TinySearchBox)

// 示例4: 动态切换语言
import { getCurrentLocale, addLocale } from '@discreted/vue-search-box'

// 添加自定义语言包
addLocale('ja-JP', {
  tvp: {
    tvpSearchbox: {
      initUse: '"{value}"を使用',
      attributeType: '属性タイプ',
      propertyValue: '{type}のプロパティ値',
      matched: 'マッチした項目',
      minValue: '最小値',
      maxValue: '最大値',
      startDate: '開始日',
      endDate: '終了日',
      startDateTime: '開始日時',
      endDateTime: '終了日時',
      pleaseSelect: '選択してください',
      customValue: 'カスタム値',
      selectAll: 'すべて選択',
      confirm: '確認'
    }
  }
})

// 示例5: 在组件中直接使用t函数
import { t } from '@discreted/vue-search-box'

export default {
  methods: {
    getText() {
      // 使用t函数获取翻译文本
      return t('tvp.tvpSearchbox.initUse', { value: 'test' })
    }
  }
}
