import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vitepress'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

const env = loadEnv(process.env.VITE_BASE_URL!, fileURLToPath(new URL('../', import.meta.url)))
const __dirname = fileURLToPath(new URL('.', import.meta.url))
// https://vitepress.dev/reference/site-co nfig
export default defineConfig({
  title: 'TinySearchBox',
  description: '一个好用的综合搜索组件',
  base: env.VITE_BASE_URL || '/tiny-search-box/',
  cleanUrls: true,
  vite: {
    resolve: {
      alias: {
        'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.runtime.esm-bundler.js'),
        '@opentiny/vue-search-box': path.resolve(__dirname, '../../search-box/index.ts'),
        '@opentiny/vue-search-box-theme': path.resolve(__dirname, '../../search-box/theme/index.less'),
        '@opentiny/vue-button': path.resolve(__dirname, '../node_modules/@opentiny/vue-button'),
        '@opentiny/vue-button-group': path.resolve(__dirname, '../node_modules/@opentiny/vue-button-group'),
        '@opentiny/vue-checkbox': path.resolve(__dirname, '../node_modules/@opentiny/vue-checkbox'),
        '@opentiny/vue-checkbox-group': path.resolve(__dirname, '../node_modules/@opentiny/vue-checkbox-group'),
        '@opentiny/vue-date-picker': path.resolve(__dirname, '../node_modules/@opentiny/vue-date-picker'),
        '@opentiny/vue-dropdown': path.resolve(__dirname, '../node_modules/@opentiny/vue-dropdown'),
        '@opentiny/vue-dropdown-item': path.resolve(__dirname, '../node_modules/@opentiny/vue-dropdown-item'),
        '@opentiny/vue-dropdown-menu': path.resolve(__dirname, '../node_modules/@opentiny/vue-dropdown-menu'),
        '@opentiny/vue-form': path.resolve(__dirname, '../node_modules/@opentiny/vue-form'),
        '@opentiny/vue-form-item': path.resolve(__dirname, '../node_modules/@opentiny/vue-form-item'),
        '@opentiny/vue-icon': path.resolve(__dirname, '../node_modules/@opentiny/vue-icon'),
        '@opentiny/vue-input': path.resolve(__dirname, '../node_modules/@opentiny/vue-input'),
        '@opentiny/vue-loading': path.resolve(__dirname, '../node_modules/@opentiny/vue-loading'),
        '@opentiny/vue-option': path.resolve(__dirname, '../node_modules/@opentiny/vue-option'),
        '@opentiny/vue-popover': path.resolve(__dirname, '../node_modules/@opentiny/vue-popover'),
        '@opentiny/vue-select': path.resolve(__dirname, '../node_modules/@opentiny/vue-select'),
        '@opentiny/vue-tag': path.resolve(__dirname, '../node_modules/@opentiny/vue-tag'),
        '@opentiny/vue-tooltip': path.resolve(__dirname, '../node_modules/@opentiny/vue-tooltip'),
        '@opentiny/vue-common': path.resolve(__dirname, '../node_modules/@opentiny/vue-common'),
        '@opentiny/vue-theme': path.resolve(__dirname, '../node_modules/@opentiny/vue-theme'),
      }
    },
    optimizeDeps: {
      exclude: ['@opentiny/vue-search-box']
    },
    build: {
      rollupOptions: {
        external: ['vue']
      }
    },
    ssr: {
      noExternal: [/@opentiny\//, '@opentiny/vue-search-box']
    }
  },
  markdown: {
    config(md) {
      // 支持区块内的方式展示 demo 和示例代码
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
  head: [['link', { rel: 'icon', href: 'favicon.ico' }]],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '案例', link: '/examples/basic-usage' }
    ],
    outline: {
      label: '页面导航'
    },
    sidebar: [
      {
        text: '简介',
        items: [
          { text: '快速开始', link: '/usage' },
          { text: '使用指南', link: '/guide/usage' }
        ]
      },
      {
        text: '指南',
        items: [
          { text: '国际化支持', link: '/guide/i18n' },
          { text: 'SaaS 模式开发', link: '/guide/saas' }
        ]
      },
      {
        text: '案例',
        items: [
          { text: '基本用法', link: '/examples/basic-usage' },
          { text: '默认包含筛选项', link: '/examples/v-model' },
          { text: '自动匹配', link: '/examples/auto-match' },
          { text: '自定义二级下拉面板', link: '/examples/custom-panel' },
          { text: '可编辑', link: '/examples/editable' },
          { text: '没有筛选项时的占位文本', link: '/examples/empty-placeholder' },
          { text: '自定义属性分组', link: '/examples/group-key' },
          { text: 'help 提示场景', link: '/examples/help' },
          { text: '指定筛选项的 ID 键取值', link: '/examples/id-map-key' },
          { text: '数据项占位文本', link: '/examples/item-placeholder' },
          { text: '输入长度限制', link: '/examples/max-length' },
          { text: '时间长度限制', link: '/examples/max-time-length' },
          { text: '合并多选标签', link: '/examples/merge-tag' },
          { text: '面板最大高度', link: '/examples/panel-max-height' },
          { text: '潜在匹配项', link: '/examples/potential-match' },
          { text: '自定义默认搜索项', link: '/examples/default-field' },
          { text: '切分输入值', link: '/examples/split-input-value' },
          { text: '事件', link: '/examples/events' }
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'props', link: '/apis/props' },
          { text: 'types', link: '/apis/types' },
          { text: 'events', link: '/apis/events' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/opentiny/tiny-search-box' }]
  }
})
