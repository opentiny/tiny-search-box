import path, { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import * as glob from 'glob'
import vue from '@vitejs/plugin-vue2'
// import vue from 'vite-plugin-vue2'


const input = glob.sync('./src/**/*.ts', {
  cwd: __dirname,
  absolute: true
})
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
function rollupOutput(target: string, format: string): any {
  return {
    format: target,
    entryFileNames: `[name].${target}.js`,
    preserveModules: true,
    dir: resolve(__dirname, 'dist/vue2', format),
    preserveModulesRoot: resolve(__dirname, 'src'),
    exports: 'named'
  }
}
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 确保指向正确的 Vue 模块
      // '@opentiny/vue-button': '@opentiny/vue-button2',
      // '@opentiny/vue-checkbox': '@opentiny/vue-checkbox2',
      // '@opentiny/vue-checkbox-group': '@opentiny/vue-checkbox-group2',
      // '@opentiny/vue-date-picker': '@opentiny/vue-date-picker2',
      // '@opentiny/vue-dropdown': '@opentiny/vue-dropdown2',
      // '@opentiny/vue-dropdown-item': '@opentiny/vue-dropdown-item2',
      // '@opentiny/vue-dropdown-menu': '@opentiny/vue-dropdown-menu2',
      // '@opentiny/vue-form': '@opentiny/vue-form2',
      // '@opentiny/vue-form-item': '@opentiny/vue-form-item2',
      // '@opentiny/vue-icon': '@opentiny/vue-icon2',
      // '@opentiny/vue-input': '@opentiny/vue-input2',
      // '@opentiny/vue-loading': '@opentiny/vue-loading2',
      // '@opentiny/vue-option': '@opentiny/vue-option2',
      // '@opentiny/vue-popover': '@opentiny/vue-popover2',
      // '@opentiny/vue-select': '@opentiny/vue-select2',
      // '@opentiny/vue-tag': '@opentiny/vue-tag2',
      // '@opentiny/vue-tooltip': '@opentiny/vue-tooltip2',
      // '@opentiny/vue-common': '@opentiny/vue-common2'
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
      // external: ['vue', 'vue-demi', '@opentiny/*'],
      external: rollupExternalFromPackage(resolve(__dirname, 'package.json')),

      output: [rollupOutput('es', 'es'), rollupOutput('cjs', 'lib')]
    }
  }
})
