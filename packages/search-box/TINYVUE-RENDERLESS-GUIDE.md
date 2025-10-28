# TinyVue Renderless 架构多版本适配指南

本文档专门针对使用 TinyVue renderless 架构的组件库，说明如何实现 Vue 2/Vue 3 多版本兼容。

## 架构概述

TinyVue 的 renderless 架构采用以下设计模式：

```
组件模板 (Template) ←→ Renderless 逻辑层 ←→ Vue 版本适配层
```

## 核心文件结构

```
src/
├── index.vue              # 组件模板（UI 层）
├── renderless.ts          # 无渲染逻辑层（核心业务逻辑）
├── composables/           # 组合式函数
├── utils/                 # 工具函数
└── components/           # 子组件
```

## 多版本兼容原理

### 1. @opentiny/vue-common 适配层

TinyVue 通过 `@opentiny/vue-common` 提供统一的 API 接口：

```javascript
import { defineComponent, setup } from '@opentiny/vue-common'
```

### 2. Renderless 函数参数注入

在 `renderless.ts` 中，Vue API 通过参数注入：

```typescript
export const renderless = (
  props,
  { getCurrentInstance, onMounted, onBeforeUnmount, computed, reactive, watch },
  { emit, nextTick, refs, vm }
) => {
  // 业务逻辑...
}
```

### 3. 组件模板集成

在 `index.vue` 中通过 setup 函数集成：

```vue
<script>
import { defineComponent, setup } from '@opentiny/vue-common'
import { renderless, api } from './renderless'

export default defineComponent({
  setup(props, context) {
    return setup({ props, context, renderless, api })
  }
})
</script>
```

## 多版本构建配置

### Vue 3 构建配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Vue 3 专用配置
})
```

### Vue 2 构建配置 (vite.config.vue2.ts)

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        whitespace: 'condense'  // Vue 2 兼容性配置
      }
    }
  })],
  // Vue 2 专用配置
})
```

## 依赖管理策略

### package.json 关键配置

```json
{
  "peerDependencies": {
    "vue": "^2.0.0 || ^3.0.0",
    "vue-demi": "latest"
  },
  "dependencies": {
    "@opentiny/vue-common": "^3.26.0",
    "vue-demi": "^0.14.0"
  },
  "devDependencies": {
    "vue2": "npm:vue@2.6.14",
    "vue2.7": "npm:vue@2.7.10", 
    "vue3": "npm:vue@3.4.38"
  }
}
```

## 开发最佳实践

### 1. 使用统一的 API 接口

```typescript
// ✅ 正确：使用注入的 API
export const renderless = (props, { reactive, watch, computed }, { emit }) => {
  const state = reactive({ /* ... */ })
  
  watch(() => props.modelValue, (newVal) => {
    // 处理逻辑
  })
}

// ❌ 错误：直接导入 Vue API
import { reactive } from 'vue'  // 避免这样使用
```

### 2. 事件处理兼容性

```typescript
// 统一的事件发射方式
const handleChange = (newValue) => {
  emit('update:modelValue', newValue)  // v-model 兼容
  emit('change', newValue)             // 普通事件
}
```

### 3. 响应式数据处理

```typescript
// 使用注入的 reactive 和 computed
const state = reactive({
  innerModelValue: [...props.modelValue],
  // 其他状态...
})

const isShowClose = computed(() => 
  props.modelValue.length > 0 || state.inputValue.length > 0
)
```

### 4. 生命周期管理

```typescript
onMounted(() => {
  // 组件挂载后的逻辑
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleOutsideClick)
  }
})

onBeforeUnmount(() => {
  // 清理工作
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleOutsideClick)
  }
})
```

## 模板开发规范

### 1. 属性传递

```vue
<template>
  <!-- 使用 renderless 返回的 API -->
  <tiny-tag
    v-for="(tag, index) in modelValue"
    :key="tag.field + index"
    @close="deleteTag"
  >
    {{ tag.label }}
  </tiny-tag>
</template>
```

### 2. 事件绑定

```vue
<template>
  <tiny-input
    v-model="state.inputValue"
    @input="handleInput"
    @keydown.enter="createTag"
  />
</template>
```

### 3. 条件渲染

```vue
<template>
  <tiny-popover v-if="editable" v-model="state.popoverVisible">
    <!-- 可编辑内容 -->
  </tiny-popover>
</template>
```

## 多版本测试策略

### 1. 环境检测工具

创建环境检测工具来验证兼容性：

```typescript
// utils/env-detector.ts
export function detectVueVersion() {
  try {
    const vue = require('vue')
    if (vue.defineComponent) return 'vue3'
    if (vue.version?.startsWith('2.7')) return 'vue2.7'
    return 'vue2'
  } catch {
    return 'vue3' // 默认
  }
}
```

### 2. 构建验证脚本

```javascript
// scripts/verify-build.js
const fs = require('fs')
const path = require('path')

// 检查构建输出是否包含所有版本
function verifyBuild() {
  const distPaths = [
    'dist/es/index.js',
    'dist/lib/index.js', 
    'dist/vue2/es/index.js',
    'dist/vue2/lib/index.js'
  ]
  
  distPaths.forEach(filePath => {
    if (!fs.existsSync(path.join(__dirname, '..', filePath))) {
      throw new Error(`构建文件缺失: ${filePath}`)
    }
  })
  
  console.log('✅ 所有版本构建验证通过')
}
```

## 发布和部署

### 1. 多入口配置

在 package.json 中配置多版本入口：

```json
{
  "exports": {
    ".": {
      "import": "./dist/es/index.js",
      "require": "./dist/lib/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./vue2": {
      "import": "./dist/vue2/es/index.js",
      "require": "./dist/vue2/lib/index.js", 
      "types": "./dist/vue2/types/index.d.ts"
    }
  }
}
```

### 2. 使用示例

```javascript
// Vue 3 项目
import { TinySearchBox } from '@discreted/vue-search-box'

// Vue 2 项目  
import { TinySearchBox } from '@discreted/vue-search-box/vue2'

// 条件导入
import { getVueCompatConfig } from '@discreted/vue-search-box/utils/env-detector'
const { isVue2 } = getVueCompatConfig()

const SearchBox = isVue2 
  ? await import('@discreted/vue-search-box/vue2')
  : await import('@discreted/vue-search-box')
```

## 故障排除

### 常见问题

1. **构建错误**
   - 检查 `@opentiny/vue-common` 版本兼容性
   - 确认 Vue 相关依赖正确安装

2. **运行时错误**
   - 验证 renderless 函数参数是否正确注入
   - 检查模板中使用的 API 是否在 renderless 中导出

3. **类型错误**
   - 确保 TypeScript 配置支持多版本
   - 检查类型定义文件生成

### 调试技巧

```typescript
// 在 renderless 中添加调试信息
console.log('Vue environment detected:', {
  hasReactive: typeof reactive === 'function',
  hasWatch: typeof watch === 'function',
  hasComputed: typeof computed === 'function'
})
```

## 性能优化建议

1. **按需导入**：确保组件支持按需导入
2. **Tree Shaking**：配置构建工具支持 Tree Shaking
3. **代码分割**：合理分割业务逻辑和 UI 逻辑

## 参考资源

- [TinyVue 官方文档](https://opentiny.design/tiny-vue)
- [Vue Demi 文档](https://github.com/vueuse/vue-demi)
- [Vue 2/3 迁移指南](https://v3-migration.vuejs.org/)

---

通过遵循本指南，您可以基于 TinyVue 的 renderless 架构构建出高质量的多版本兼容组件库。