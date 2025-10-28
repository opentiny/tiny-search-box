import path from 'node:path'
import scriptSetupPlugin from 'unplugin-vue2-script-setup/vite'
import { defineConfig, loadEnv } from 'vite'
import dynamicImportPlugin from 'vite-plugin-dynamic-import'
import importPlugin from '@opentiny/vue-vite-import'
import inspectPlugin from 'vite-plugin-inspect'
import { createVuePlugin as vue2Plugin } from 'vite-plugin-vue2'
import { createSvgPlugin as vue2SvgPlugin } from 'vite-plugin-vue2-svg'


export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '')

  return {
    server: {
      host: 'localhost',
      open: true
    },
    define: {
      'process.env': {
        TINY_MODE: 'pc'
      }
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
      // importPlugin({
      //   options: [
      //     {
      //       libraryName: '@opentiny/vue'
      //     },
      //     ...['icon', 'icon-saas'].map((lib) => ({
      //       libraryName: `@opentiny/vue-${lib}`,
      //       customName: (name) => {
      //         return name === 'default'
      //           ? `@opentiny/vue-${lib}$`
      //           : `@opentiny/vue-${lib}/${name.replace(/^icon-/, '')}/index.ts`
      //       }
      //     }))
      //   ],
      //   exclude: [/\.md\?.+\.js/]
      // }),
      dynamicImportPlugin()
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.vue'],
      alias: {
      }
    },
    // define: {
    //   'process.env': env
    // },
  }
})
