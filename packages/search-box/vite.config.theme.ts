import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { writeFileSync, readFileSync } from 'fs'

// 生成 package.json 的插件
function generatePackageJsonPlugin() {
  return {
    name: 'generate-package-json',
    writeBundle() {
      const rootDir = resolve(__dirname)
      const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))

      const themePackageJson = {
        name: '@opentiny/vue-search-box-theme',
        version: packageJson.version, // theme 版本与主版本一致
        description: 'Theme styles for @opentiny/vue-search-box',
        main: 'index.css',
        files: ['index.css'],
        sideEffects: ['*.css'],
        publishConfig: {
          access: 'public'
        },
        keywords: [...(packageJson.keywords || []), 'theme', 'css', 'styles'],
        license: packageJson.license,
        repository: packageJson.repository,
        homepage: packageJson.homepage,
        bugs: packageJson.bugs
      }

      const distDir = resolve(__dirname, 'dist/theme')
      writeFileSync(resolve(distDir, 'package.json'), JSON.stringify(themePackageJson, null, 2), 'utf-8')
      console.log(`✅ 已生成 package.json: ${resolve(distDir, 'package.json')}`)
    }
  }
}

export default defineConfig({
  plugins: [generatePackageJsonPlugin()],
  build: {
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'theme/index.less'),
      output: {
        dir: resolve(__dirname, 'dist/theme'),
        assetFileNames: 'index.css'
      }
    }
  },
  css: {
    // 禁用 PostCSS（theme 构建不使用 tailwindcss）
    postcss: {
      plugins: []
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 设置 Less 的路径解析，避免查找不存在的文件
        paths: [resolve(__dirname, 'theme')]
      }
    }
  }
})