# Vue 多版本兼容性构建指南

本文档说明如何为不同 Vue 版本构建和发布兼容的组件库。

## 环境要求

- Node.js >= 14
- pnpm >= 7 (推荐) 或 npm >= 6

## 项目结构

```
packages/search-box/
├── src/                    # 源代码
│   ├── composables/        # 组合式函数
│   ├── utils/              # 工具函数
│   ├── components/         # 组件
│   └── examples/           # 使用示例
├── dist/                   # 构建输出
│   ├── es/                 # ES 模块格式
│   ├── lib/                # CommonJS 格式  
│   └── vue2/               # Vue 2 专用构建
├── scripts/                # 构建脚本
└── *.config.ts            # 配置文件
```

## 构建命令

### 构建 Vue 3 版本
```bash
pnpm build:vue3
# 或
npm run build:vue3
```

### 构建 Vue 2 版本
```bash
pnpm build:vue2
# 或  
npm run build:vue2
```

### 构建所有版本
```bash
pnpm build:all
# 或
npm run build:all
```

## 发布配置

### package.json 关键配置

```json
{
  "peerDependencies": {
    "vue": "^2.0.0 || ^3.0.0",
    "vue-demi": "latest"
  },
  "dependencies": {
    "vue-demi": "^0.14.0",
    "@opentiny/vue-common": "^3.26.0"
  },
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

## 使用方式

### Vue 3 项目中使用
```javascript
import { TinySearchBox } from '@discreted/vue-search-box'

// 或按需导入
import TinySearchBox from '@discreted/vue-search-box/dist/es/index.vue'
```

### Vue 2 项目中使用  
```javascript
// 方式1：使用 vue2 子路径
import { TinySearchBox } from '@discreted/vue-search-box/vue2'

// 方式2：直接导入构建文件
import TinySearchBox from '@discreted/vue-search-box/dist/vue2/es/index.vue'
```

### 条件导入（推荐）
```javascript
import { getVueCompatConfig } from '@discreted/vue-search-box/utils/env-detector'

const { isVue2, isVue3 } = getVueCompatConfig()

if (isVue2) {
  const { TinySearchBox } = await import('@discreted/vue-search-box/vue2')
  // 使用 Vue 2 版本
} else {
  const { TinySearchBox } = await import('@discreted/vue-search-box')
  // 使用 Vue 3 版本
}
```

## 兼容性适配原理

### 1. vue-demi 适配层
使用 `vue-demi` 作为 Vue 版本适配层，它提供统一的 API 接口：

```javascript
import { reactive, computed, watch } from 'vue-demi'
// 自动适配 Vue 2 或 Vue 3 的 API
```

### 2. 运行时环境检测
通过 `env-detector.ts` 检测当前 Vue 版本：

```typescript
// 检测 Vue 版本
export function detectVueVersion(): 'vue2' | 'vue2.7' | 'vue3'

// 获取兼容性配置  
export function getVueCompatConfig()
```

### 3. 构建时适配
通过不同的构建配置生成对应版本的代码：

- **Vue 3 构建**: 使用 `@vitejs/plugin-vue`
- **Vue 2 构建**: 使用 `vite-plugin-vue2`

## 开发注意事项

### 1. API 使用规范
- 始终使用 `vue-demi` 导出的 API
- 避免直接导入 `vue` 或 `@vue/composition-api`
- 使用 `defineComponent` 包装组件

### 2. 模板语法差异
- Vue 2 和 Vue 3 的模板语法基本一致
- 注意 Vue 2 不支持 Fragments（多个根节点）
- 事件修饰符略有差异

### 3. 组件注册差异
```javascript
// Vue 3
app.component('TinySearchBox', TinySearchBox)

// Vue 2  
Vue.component('TinySearchBox', TinySearchBox)
```

### 4. 响应式系统
- Vue 2 使用 `Vue.observable` 或 `@vue/composition-api`
- Vue 3 使用 `reactive` 和 `ref`
- 通过 `vue-demi` 统一接口

## 测试策略

### 单元测试
```bash
# 测试 Vue 3 版本
VUE_VERSION=3 pnpm test

# 测试 Vue 2 版本  
VUE_VERSION=2 pnpm test
```

### 集成测试
在不同 Vue 版本的实际项目中测试组件功能。

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `vue-demi` 版本兼容性
   - 确认 Vue 相关依赖正确安装

2. **运行时错误**
   - 检查是否正确设置了 Vue 版本
   - 验证组件导入路径

3. **类型错误**
   - 确保 TypeScript 配置正确
   - 检查类型定义文件生成

### 调试技巧

```javascript
// 在开发时输出环境信息
console.log('Vue environment:', getVueCompatConfig())
```

## 版本管理

- 主版本号对应 Vue 主要版本兼容性
- 次版本号对应功能更新
- 修订版本号对应 bug 修复

示例：`1.0.0` 表示支持 Vue 2 和 Vue 3 的第一个稳定版本。

## 参考资源

- [vue-demi 文档](https://github.com/vueuse/vue-demi)
- [Vue 2 迁移指南](https://v3-migration.vuejs.org/)
- [TinyVue 多版本适配](https://opentiny.design/tiny-vue)

---

通过遵循本指南，您可以构建出同时支持 Vue 2 和 Vue 3 的组件库，确保在不同环境下的兼容性和稳定性。