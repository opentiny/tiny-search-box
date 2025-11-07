# SaaS 模式开发指南

TinySearchBox 组件库支持 SaaS 主题，提供了专门的主题样式和配置方式。

## 安装 SaaS 主题

```bash
npm install @opentiny/vue-search-box-theme-saas
```

## 引入样式

### 一：直接引入 CSS

```javascript
import '@opentiny/vue-search-box-theme-saas'
```

## 二：使用 alias 替换间接依赖组件风格

在 `vite.config.js` 中配置 SaaS 模式：

```javascript
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@opentiny/vue-theme': resolve('node_modules/@opentiny/vue-theme-saas'),
        '@opentiny/vue-icon': resolve(__dirname, 'node_modules/@opentiny/vue-icon-saas')
      }
    }
  }
})
```

## 三：使用 ConfigProvider 和 designSaasConfig

在应用入口处使用 `ConfigProvider` 组件包裹应用，并传入 `designSaasConfig` 配置：

```vue
<template>
  <ConfigProvider :config="designSaasConfig">
    <tiny-search-box v-model="tags" :items="items" />
  </ConfigProvider>
</template>

<script setup>
import { ref } from 'vue'
import ConfigProvider from '@opentiny/vue-config-provider'
import designSaasConfig from '@opentiny/vue-design-saas'
import TinySearchBox from '@opentiny/vue-search-box'
// 引入 SaaS 主题
import '@opentiny/vue-search-box-theme-saas'

const tags = ref([])
const items = ref([
  // ... 配置项
])
</script>
```

## 启动 SaaS 模式

### 开发模式

```bash
vite --mode saas
```

## 在代码中使用

### Vue

```vue
<template>
  <tiny-search-box v-model="tags" :items="items" />
</template>

<script setup>
import { ref } from 'vue'
import TinySearchBox from '@opentiny/vue-search-box'
// 引入 SaaS 主题
import '@opentiny/vue-search-box-theme-saas'

const tags = ref([])
const items = ref([
  // ... 配置项
])
</script>
```

## 样式定制

SaaS 模式使用 Less 和 Tailwind CSS，你可以通过以下方式定制样式：

### 1. 覆盖 Less 变量

```less
// 在你的样式文件中
@import '@opentiny/vue-search-box-theme-saas/index.less';

// 覆盖变量
@primary-color: #1890ff;
@border-radius: 4px;
```

### 2. 使用 Tailwind CSS 配置

创建 `tailwind.config.cjs`：

```javascript
module.exports = {
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@opentiny/vue-search-box-theme-saas/**/*.{less,css}'
  ],
  theme: {
    extend: {
      // 自定义主题
    }
  },
  plugins: []
}
```

## 开发注意事项

1. **PostCSS 配置**：SaaS 模式需要 PostCSS 和 Tailwind CSS，确保已安装相关依赖
2. **Less 路径**：确保 Less 路径配置正确，能够解析 `@opentiny/vue-theme-saas` 中的变量
3. **开发模式**：开发模式下使用 Less 文件以支持实时变更，生产模式使用编译后的 CSS
4. **模式切换**：通过 Vite 的 `mode` 参数切换模式，而不是在代码中硬编码

## 相关资源

- [使用指南](./usage.md)
- [国际化支持](./i18n.md)
- [API 文档](../apis/props.md)
