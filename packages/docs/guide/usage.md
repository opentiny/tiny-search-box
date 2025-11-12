# 使用指南

本文档介绍如何在项目中使用 TinySearchBox 组件库。

## 安装

### npm

```bash
npm install @opentiny/vue-search-box
```

### pnpm

```bash
pnpm add @opentiny/vue-search-box
```

### yarn

```bash
yarn add @opentiny/vue-search-box
```

## 样式说明

组件包已内置样式文件，**无需单独引入样式**。样式会在导入组件时自动加载。

### 包说明

- **普通主题包**：`@opentiny/vue-search-box`
  - Vue2 版本：`2.27.1`
  - Vue3 版本：`3.27.1`
  
- **SaaS 主题包**：`@opentiny/vue-search-box-saas`
  - Vue2 版本：`2.27.1`
  - Vue3 版本：`3.27.1`

### 手动引入样式（可选）

如果需要手动控制样式加载，可以单独引入：


## 基本使用

### Vue 3

```vue
<template>
  <tiny-search-box v-model="tags" :items="items" />
</template>

<script setup>
import { ref } from 'vue'
import TinySearchBox from '@opentiny/vue-search-box'

const tags = ref([])
const items = ref([
  {
    label: '名称',
    field: 'testName',
    options: [
      { label: 'test-1' },
      { label: 'test-2' }
    ]
  },
  {
    label: '状态',
    field: 'status',
    type: 'checkbox',
    options: [
      { label: '启用', id: '1' },
      { label: '禁用', id: '2' }
    ]
  }
])
</script>
```

### Vue 2

```vue
<template>
  <tiny-search-box v-model="tags" :items="items" />
</template>

<script>
import TinySearchBox from '@opentiny/vue-search-box'

export default {
  components: {
    TinySearchBox
  },
  data() {
    return {
      tags: [],
      items: [
        {
          label: '名称',
          field: 'testName',
          options: [
            { label: 'test-1' },
            { label: 'test-2' }
          ]
        },
        {
          label: '状态',
          field: 'status',
          type: 'checkbox',
          options: [
            { label: '启用', id: '1' },
            { label: '禁用', id: '2' }
          ]
        }
      ]
    }
  }
}
</script>
```

## 全局注册

### Vue 3

```javascript
import { createApp } from 'vue'
import TinySearchBox from '@opentiny/vue-search-box'

const app = createApp(App)
app.use(TinySearchBox)
app.mount('#app')
```

### Vue 2

```javascript
import Vue from 'vue'
import TinySearchBox from '@opentiny/vue-search-box'

Vue.use(TinySearchBox)
```

## 配置国际化

组件库支持国际化，详细配置请参考 [国际化支持](./i18n.md)。

```javascript
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import TinySearchBox, { zhCN, enUS, setGlobalApp } from '@opentiny/vue-search-box'

const i18n = createI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

const app = createApp(App)
app.use(i18n)
app.use(TinySearchBox)
setGlobalApp(app) // 设置全局 app 实例
app.mount('#app')
```

## 常用配置

### 基本配置项

- `v-model` / `modelValue` - 绑定选中的标签列表
- `items` - 搜索项配置数组
- `emptyPlaceholder` - 空状态时的占位符文本
- `editable` - 是否可编辑标签
- `showHelp` - 是否显示帮助按钮
- `maxlength` - 输入框最大长度限制
- `panelMaxHeight` - 下拉面板最大高度

### 搜索项类型

组件支持多种搜索项类型：

- `radio` - 单选（默认）
- `checkbox` - 多选
- `noValue` - 无值类型
- `map` - 键值对类型
- `numRange` - 数字区间
- `dateRange` - 日期区间
- `dateTimeRange` - 日期时间区间
- `custom` - 自定义类型

### 示例配置

```javascript
const items = [
  // 单选类型
  {
    label: '名称',
    field: 'name',
    options: [
      { label: '选项1', id: '1' },
      { label: '选项2', id: '2' }
    ]
  },
  // 多选类型
  {
    label: '状态',
    field: 'status',
    type: 'checkbox',
    options: [
      { label: '启用', id: '1' },
      { label: '禁用', id: '2' }
    ]
  },
  // 数字区间
  {
    label: '大小',
    field: 'size',
    type: 'numRange',
    start: 0,
    min: 0,
    max: 100,
    unit: 'GB'
  },
  // 日期区间
  {
    label: '创建时间',
    field: 'createTime',
    type: 'dateRange',
    format: 'yyyy-MM-dd'
  }
]
```

## 事件处理

组件提供了丰富的事件：

- `change` - 标签列表变化时触发
- `search` - 点击搜索按钮或按回车时触发
- `clear` - 清空所有标签时触发
- `help` - 点击帮助按钮时触发
- `first-level-select` - 选择第一级选项时触发
- `exceed` - 输入超出最大长度时触发
- `tag-click` - 点击已选中标签触发

```vue
<template>
  <tiny-search-box
    v-model="tags"
    :items="items"
    @change="handleChange"
    @search="handleSearch"
    @clear="handleClear"
  />
</template>

<script setup>
const handleChange = (newTags, oldTags) => {
  console.log('标签变化:', newTags, oldTags)
}

const handleSearch = (tags) => {
  console.log('搜索:', tags)
}

const handleClear = () => {
  console.log('已清空')
}
</script>
```

## 完整示例

查看 [示例页面](../examples/basic-usage.md) 了解更多使用示例。

## 类型定义

组件库提供了完整的 TypeScript 类型定义：

```typescript
import type { ISearchBoxItem, ISearchBoxTag } from '@opentiny/vue-search-box'

const items: ISearchBoxItem[] = [
  // ...
]

const tags: ISearchBoxTag[] = []
```

## 注意事项

1. **样式引入**：组件包已内置样式，导入组件时会自动加载，无需手动引入
2. **Vue 版本**：确保使用正确的 Vue 版本（Vue 2 或 Vue 3），并安装对应版本的包
3. **国际化配置**：如需使用国际化，请正确配置 `setGlobalApp`
4. **主题选择**：根据项目需求选择普通主题包（`@opentiny/vue-search-box`）或 SaaS 主题包（`@opentiny/vue-search-box-saas`）
5. **包结构**：每个包包含 `index.js`（组件代码）和 `index.css`（样式文件），样式会自动导入

