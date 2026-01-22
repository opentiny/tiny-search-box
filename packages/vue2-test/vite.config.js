import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import scriptSetupPlugin from 'unplugin-vue2-script-setup/vite'
import { defineConfig, loadEnv } from 'vite'
import dynamicImportPlugin from 'vite-plugin-dynamic-import'
import { createVuePlugin as vue2Plugin } from 'vite-plugin-vue2'
import { createSvgPlugin as vue2SvgPlugin } from 'vite-plugin-vue2-svg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

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
    // 配置依赖预构建，确保 @opentiny/vue 正确预构建
    optimizeDeps: {
      include: ['@opentiny/vue', '@opentiny/vue-common'],
      exclude: ['@opentiny/vue-search-box']
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
        'vue': resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
        'vue$': resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
        'vue-template-compiler': resolve(__dirname, 'node_modules/vue-template-compiler'),
        '@demos': resolve(__dirname, '../../packages/docs/search-box'),
        "@opentiny/vue": resolve(__dirname, '../search-box/node_modules/@opentiny/vue'),
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
          // Saas 模式下，限制路径解析，避免自动引入 theme/vars.less
          paths: isSaas
            ? [
              // 只包含 theme-saas 目录，不包含 theme 目录
              resolve(__dirname, `../search-box/theme${isSaas ? '-saas' : ''}`),
            ]
            : [
              // 普通模式：包含 theme 目录
              resolve(__dirname, `../search-box/theme${isSaas ? '-saas' : ''}`),
            ],
        },
      },
      postcss: isSaas
        ? (() => {
            // Saas 模式：直接加载 PostCSS 配置并应用插件
            const postcssConfigPath = resolve(__dirname, '../search-box/postcss.config.cjs');
            const postcssConfig = require(postcssConfigPath);
            return postcssConfig;
          })()
        : {
            // 普通模式：禁用 PostCSS，避免自动查找 postcss.config.cjs
            plugins: []
          },
    }
  }
})
