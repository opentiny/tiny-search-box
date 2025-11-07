import { resolve } from 'path'
import scriptSetupPlugin from 'unplugin-vue2-script-setup/vite'
import { defineConfig, loadEnv } from 'vite'
import dynamicImportPlugin from 'vite-plugin-dynamic-import'
import { createVuePlugin as vue2Plugin } from 'vite-plugin-vue2'
import { createSvgPlugin as vue2SvgPlugin } from 'vite-plugin-vue2-svg'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // 判断是否为 saas 模式
  const isSaas = mode === 'saas'

  // 判断是否为开发模式
  const isDev = process.env.NODE_ENV !== 'production'

  // 调试信息
  console.log(`🔧 Vite 配置模式: ${mode}`)
  console.log(`📦 Saas 模式: ${isSaas ? '是' : '否'}`)
  console.log(`🛠️  开发模式: ${isDev ? '是' : '否'}`)

  return {
    server: {
      host: 'localhost',
      open: true
    },
    define: {
      // 定义全局变量，用于在运行时判断模式
      'process.env.TINY_MODE': JSON.stringify(isSaas ? 'saas' : 'pc'),
      'process.env.TINY_THEME': JSON.stringify(isSaas ? 'saas' : 'tiny'),
    },
    plugins: [
      vue2Plugin({
        jsx: true,
        include: [/\.vue$/, /\.md$/]
      }),

      scriptSetupPlugin(),
      vue2SvgPlugin({
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false
                }
              }
            },
            'prefixIds'
          ]
        }
      }),
      dynamicImportPlugin()
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.vue'],
      alias: {
        'vue': resolve('node_modules/vue/dist/vue.esm.js'),
        'vue$': resolve('node_modules/vue/dist/vue.esm.js'),
        '@demos': resolve('../../packages/docs/search-box'),
        "@opentiny/vue-button": resolve('../search-box/node_modules/@opentiny/vue-button'),
        "@opentiny/vue-button-group": resolve('../search-box/node_modules/@opentiny/vue-button-group'),
        "@opentiny/vue-checkbox": resolve('../search-box/node_modules/@opentiny/vue-checkbox'),
        "@opentiny/vue-checkbox-group": resolve('../search-box/node_modules/@opentiny/vue-checkbox-group'),
        "@opentiny/vue-date-picker": resolve('../search-box/node_modules/@opentiny/vue-date-picker'),
        "@opentiny/vue-dropdown": resolve('../search-box/node_modules/@opentiny/vue-dropdown'),
        "@opentiny/vue-dropdown-item": resolve('../search-box/node_modules/@opentiny/vue-dropdown-item'),
        "@opentiny/vue-dropdown-menu": resolve('../search-box/node_modules/@opentiny/vue-dropdown-menu'),
        "@opentiny/vue-form": resolve('../search-box/node_modules/@opentiny/vue-form'),
        "@opentiny/vue-form-item": resolve('../search-box/node_modules/@opentiny/vue-form-item'),
        "@opentiny/vue-input": resolve('../search-box/node_modules/@opentiny/vue-input'),
        "@opentiny/vue-loading": resolve('../search-box/node_modules/@opentiny/vue-loading'),
        "@opentiny/vue-option": resolve('../search-box/node_modules/@opentiny/vue-option'),
        "@opentiny/vue-popover": resolve('../search-box/node_modules/@opentiny/vue-popover'),
        "@opentiny/vue-select": resolve('../search-box/node_modules/@opentiny/vue-select'),
        "@opentiny/vue-tag": resolve('../search-box/node_modules/@opentiny/vue-tag'),
        "@opentiny/vue-tooltip": resolve('../search-box/node_modules/@opentiny/vue-tooltip'),
        "@opentiny/vue-common": resolve('../search-box/node_modules/@opentiny/vue-common'),
        '@opentiny/vue-search-box': resolve('../search-box/index.ts'),
        // 根据模式映射 theme 和 icon
        // 根据模式映射主题样式文件
        '@opentiny/vue-search-box-theme': resolve(`../search-box/theme${isSaas ? '-saas' : ''}/index.less`),
        "@opentiny/vue-theme": resolve(`../search-box/node_modules/@opentiny/vue-theme${isSaas ? '-saas' : ''}`),
        "@opentiny/vue-icon": resolve(`node_modules/@opentiny/vue-icon${isSaas ? '-saas' : ''}`)
      },
      dedupe: ['vue']
    },
    // 根据模式配置 CSS
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      postcss: isSaas && isDev
        ? {
          // Saas 开发模式：配置 PostCSS 处理 Tailwind
          // 使用 search-box 的 PostCSS 配置
          config: resolve('../search-box/postcss.config.cjs'),
        }
        : undefined,
    }
  }
})
