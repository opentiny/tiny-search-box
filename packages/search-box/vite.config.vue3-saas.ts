import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { clearOutputDir, moveTypesFiles, includeStyle, autoImportStyle } from './scripts/plugin-utils'

export default defineConfig({
  plugins: [
    // 构建前清空输出目录
    clearOutputDir(resolve(__dirname, 'dist/vue3-saas'), 'Vue3-Saas'),
    vue(),
    dts({
      outDir: 'dist/vue3-saas/types',
      include: ['src/index.type.ts'],
      entryRoot: 'src'
    }),
    // 移动类型文件：从 types/src/ 移到 types/
    moveTypesFiles(resolve(__dirname, 'dist/vue3-saas/types')),
    // 包含 Saas 主题样式
    includeStyle({
      lessSrcPath: resolve(__dirname, 'theme-saas/index.less'),
      outDir: resolve(__dirname, 'dist/vue3-saas'),
      cssFileName: 'index.css',
      isSaas: true,
      postcssConfigPath: resolve(__dirname, 'postcss.config.cjs'),
      tailwindConfigPath: resolve(__dirname, 'tailwind.config.cjs'),
      cwd: __dirname
    }),
    // 自动导入样式
    autoImportStyle('./index.css', resolve(__dirname, 'dist/vue3-saas'))
  ],
  resolve: {
    alias: {
      'vue': resolve('node_modules/vue/dist/vue.esm.js'),
      vue$: resolve('node_modules/vue/dist/vue.esm.js'),
      // 开发环境和打包环境都支持样式别名导入
      '@opentiny/vue-search-box-theme': resolve(__dirname, 'theme-saas/index.less')
    }
  },
  build: {
    outDir: 'dist/vue3-saas',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'TinySearchBox',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      // 启用 tree-shaking，确保按需打包
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      external: (id) => {
        // 排除 vue 和所有 @opentiny/vue 相关依赖
        if (id === 'vue' || id.startsWith('@opentiny/vue')) {
          return true
        }
        // 排除 streamsaver（@opentiny/vue 的内部依赖，可能导致 ESM 导入错误）
        if (id === 'streamsaver' || id.startsWith('streamsaver/')) {
          return true
        }
        return false
      },
      output: {
        globals: {
          vue: 'Vue'
        },
        // 允许输出 CSS 文件
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'index.css'
          }
          return assetInfo.name || 'asset'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },

  css: {
    // Saas 主题需要 PostCSS 处理 Tailwind，但我们在插件中处理
    postcss: {
      plugins: []
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // Saas 模式下，限制路径解析，只包含 theme-saas 目录，避免解析到 theme 目录
        paths: [resolve(__dirname, 'theme-saas')]
      }
    }
  }
})
