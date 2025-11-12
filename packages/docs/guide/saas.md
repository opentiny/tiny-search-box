# SaaS 模式开发指南

TinySearchBox 组件库支持 SaaS 主题，提供了专门的主题样式和配置方式。

## 安装 SaaS 主题包

### Vue 3

```bash
npm install @opentiny/vue-search-box-saas
```

### Vue 2

```bash
npm install @opentiny/vue-search-box-saas@2.27.1
```

## 使用说明

SaaS 主题包已内置样式文件，**无需单独引入样式**。样式会在导入组件时自动加载。

### 手动引入样式（可选）

如果需要手动控制样式加载，可以单独引入：

```javascript
import '@opentiny/vue-search-box-saas/index.css'
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
import TinySearchBox from '@opentiny/vue-search-box-saas'

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

## 样式定制

SaaS 模式使用 Less 和 Tailwind CSS，你可以通过以下方式定制样式：

### 1. 覆盖 Less 变量

```less
// 在你的样式文件中
@import '@opentiny/vue-search-box-saas/index.css';

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
    './node_modules/@opentiny/vue-search-box-saas/**/*.{js,css}'
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

1. **包选择**：使用 SaaS 主题时，请安装 `@opentiny/vue-search-box-saas` 包，而不是普通主题包
2. **Vue 版本**：确保安装对应 Vue 版本的 SaaS 主题包（Vue2: 2.27.1, Vue3: 3.27.1）
3. **样式自动加载**：SaaS 主题包的样式会在导入组件时自动加载，无需手动引入
4. **样式定制**：如需定制样式，可以通过 CSS 变量或覆盖类名来实现
5. **PostCSS 配置**：如果项目中使用 Tailwind CSS，需要正确配置 content 路径

## 相关资源

- [使用指南](./usage.md)
- [国际化支持](./i18n.md)
- [API 文档](../apis/props.md)
