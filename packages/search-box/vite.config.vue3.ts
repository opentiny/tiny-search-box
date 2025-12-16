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
      vue$: resolve('node_modules/vue/dist/vue.esm.js')
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
    rollupOptions: {
      external: [
        'vue',
        '@opentiny/vue-button',
        '@opentiny/vue-button-group',
        '@opentiny/vue-checkbox',
        '@opentiny/vue-checkbox-group',
        '@opentiny/vue-date-picker',
        '@opentiny/vue-dropdown',
        '@opentiny/vue-dropdown-item',
        '@opentiny/vue-dropdown-menu',
        '@opentiny/vue-form',
        '@opentiny/vue-form-item',
        '@opentiny/vue-icon',
        '@opentiny/vue-input',
        '@opentiny/vue-loading',
        '@opentiny/vue-option',
        '@opentiny/vue-popover',
        '@opentiny/vue-select',
        '@opentiny/vue-tag',
        '@opentiny/vue-tooltip',
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
        javascriptEnabled: true
      }
    }
  }
})
