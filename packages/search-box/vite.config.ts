import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as glob from 'glob'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

interface Manifest {
  version: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
export function getPackageManifest(pkgPath: string): Manifest {
  return JSON.parse(readFileSync(pkgPath, 'utf8')) as Manifest
}
export function rollupExternalFromPackage(pkgPath: string) {
  const { dependencies, peerDependencies } = getPackageManifest(pkgPath)
  const dependenciesKeys = Object.keys(dependencies ?? {})
  const peerDependenciesKeys = Object.keys(peerDependencies ?? {})
  return (id: string) => {
    const packages = new Set([...peerDependenciesKeys, ...dependenciesKeys])
    return Array.from(packages).some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
  }
}
console.log('99999999999999999999999999', rollupExternalFromPackage(resolve(__dirname, 'package.json')))

function rollupOutput(target: string, format: string): any {
  return {
    format: target,
    entryFileNames: `[name].${target}.js`,
    preserveModules: true,
    dir: resolve(__dirname, 'dist/vue3', format),
    preserveModulesRoot: resolve(__dirname, 'src'),
    exports: 'named'
  }
}

const input = glob.sync('./src/**/*.ts', {
  cwd: __dirname,
  absolute: true
})

export default defineConfig({
  plugins: [dts({ outDir: './dist/types' }), vue()],
  resolve: {
    alias: {
      // Vue3 构建不再将 vue 指向 vue-demi，避免使用到 Vue2 编译产物
      // "vue": "vue-demi",
      // '@opentiny/vue-button': '@opentiny/vue-button',
      // '@opentiny/vue-checkbox': '@opentiny/vue-checkbox',
      // '@opentiny/vue-checkbox-group': '@opentiny/vue-checkbox-group',
      // '@opentiny/vue-date-picker': '@opentiny/vue-date-picker',
      // '@opentiny/vue-dropdown': '@opentiny/vue-dropdown',
      // '@opentiny/vue-dropdown-item': '@opentiny/vue-dropdown-item',
      // '@opentiny/vue-dropdown-menu': '@opentiny/vue-dropdown-menu',
      // '@opentiny/vue-form': '@opentiny/vue-form',
      // '@opentiny/vue-form-item': '@opentiny/vue-form-item',
      // '@opentiny/vue-icon': '@opentiny/vue-icon',
      // '@opentiny/vue-input': '@opentiny/vue-input',
      // '@opentiny/vue-loading': '@opentiny/vue-loading',
      // '@opentiny/vue-option': '@opentiny/vue-option',
      // '@opentiny/vue-popover': '@opentiny/vue-popover',
      // '@opentiny/vue-select': '@opentiny/vue-select',
      // '@opentiny/vue-tag': '@opentiny/vue-tag',
      // '@opentiny/vue-tooltip': '@opentiny/vue-tooltip',
      // '@opentiny/vue-common': '@opentiny/vue-common'
    }
  },
  build: {
    assetsDir: '',
    sourcemap: false,
    minify: false,
    cssCodeSplit: true, // 分离 CSS 文件
    rollupOptions: {
      input,
      treeshake: false,
      preserveEntrySignatures: 'allow-extension',
      // external: rollupExternalFromPackage(resolve(__dirname, 'package.json')),
      external: [
        'vue',
        '@opentiny/*',
        "vue-demi"
      ],
      output: [rollupOutput('es', 'es'), rollupOutput('cjs', 'lib')]
    }
  }
})
