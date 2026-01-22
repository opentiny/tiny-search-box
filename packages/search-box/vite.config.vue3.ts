import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { clearOutputDir, moveTypesFiles, includeStyle, autoImportStyle } from './scripts/plugin-utils'

export default defineConfig({
  plugins: [
    // 构建前清空输出目录
    clearOutputDir(resolve(__dirname, 'dist/vue3'), 'Vue3'),
    vue(),
    dts({
      outDir: 'dist/vue3/types',
      // 只输出 index.type.ts，对应 moveTypesFiles 会把它移动到 dist/vue3/types
      include: ['src/index.type.ts'],
      entryRoot: 'src'
    }),
    // 移动类型文件：从 types/src/ 移到 types/
    moveTypesFiles(resolve(__dirname, 'dist/vue3/types')),
    // 包含普通主题样式
    includeStyle({
      lessSrcPath: resolve(__dirname, 'theme/index.less'),
      outDir: resolve(__dirname, 'dist/vue3'),
      cssFileName: 'index.css',
      isSaas: false,
      cwd: __dirname
    }),
    // 自动导入样式
    autoImportStyle('./index.css', resolve(__dirname, 'dist/vue3'))
  ],
  resolve: {
    alias: {
      'vue': resolve('node_modules/vue/dist/vue.esm.js'),
      vue$: resolve('node_modules/vue/dist/vue.esm.js'),
      // 开发环境和打包环境都支持样式别名导入
      '@opentiny/vue-search-box-theme': resolve(__dirname, 'theme/index.less')
    }
  },
  build: {
    outDir: 'dist/vue3',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'TinySearchBox',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    // 启用 tree-shaking，确保按需打包
    minify: 'esbuild',
    rollupOptions: {
      // 启用 tree-shaking，确保按需打包
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      external: [
        'vue',
        '@opentiny/vue',
        '@opentiny/vue-common',
        '@opentiny/vue-theme'
      ],
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
    // 禁用 PostCSS（普通主题不使用 tailwindcss）
    postcss: {
      plugins: []
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 普通模式下，限制路径解析，只包含 theme 目录，避免解析到 theme-saas 目录
        paths: [resolve(__dirname, 'theme')]
      }
    }
  }
})
