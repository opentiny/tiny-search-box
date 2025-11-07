import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import Module from 'module'
import { createRequire } from 'module'
import { existsSync } from 'fs'
import { clearOutputDir, moveTypesFiles, removeCssOutput } from './scripts/plugin-utils'

// 在导入 vite-plugin-vue2 之前，修改模块解析，确保它只能看到 Vue2
// @ts-ignore - Module._resolveFilename 是 Node.js 内部 API
const originalResolveFilename = Module._resolveFilename
const rootDir = __dirname
const vue2Path = resolve(rootDir, 'node_modules/vue2/dist/vue.esm.js')
const vue2PackagePath = resolve(rootDir, 'node_modules/vue2')

// 修改模块解析，让所有 'vue' 请求都解析到 vue2
// @ts-ignore - Module._resolveFilename 是 Node.js 内部 API
Module._resolveFilename = function (request, parent, isMain, options) {
    if (request === 'vue') {
        try {
            // 优先返回 vue2 路径
            if (existsSync(vue2Path)) {
                return vue2Path
            }
            if (existsSync(resolve(vue2PackagePath, 'package.json'))) {
                return resolve(vue2PackagePath, 'index.js') || vue2PackagePath
            }
        } catch (e) {
            // 忽略错误，继续原始逻辑
        }
    }
    return originalResolveFilename.call(this, request, parent, isMain, options)
}

// 设置 NODE_PATH 环境变量，让模块解析优先找到 vue2
const originalNodePath = process.env.NODE_PATH || ''
process.env.NODE_PATH = [vue2PackagePath, originalNodePath].filter(Boolean).join(process.platform === 'win32' ? ';' : ':')

// 现在安全导入 vite-plugin-vue2（使用修改后的模块解析）
const require = createRequire(import.meta.url)

// 先确保 vue2 可以被解析
try {
    // 尝试解析 vue2，如果成功会缓存到 require.cache
    try {
        require.resolve('vue2')
    } catch (e) {
        // vue2 可能不存在，忽略
    }
} catch (e) {
    // 忽略
}

// 导入 vite-plugin-vue2
let createVuePlugin
try {
    const vitePluginVue2 = require('vite-plugin-vue2')
    createVuePlugin = vitePluginVue2.createVuePlugin || vitePluginVue2.default?.createVuePlugin || vitePluginVue2.default
    if (!createVuePlugin) {
        throw new Error('无法找到 createVuePlugin')
    }
    console.log('vite-plugin-vue2 加载成功（使用 Vue2）')
} catch (error) {
    console.error('无法加载 vite-plugin-vue2:', error)
    throw error
}

// 强制使用 Vue 2 的模板编译器
const vueTemplateCompiler = require('vue-template-compiler')

export default defineConfig({
    plugins: [
        // 构建前清空输出目录
        clearOutputDir(resolve(__dirname, 'dist/vue2'), 'Vue2'),
        createVuePlugin({
            vueTemplateOptions: {
                compiler: vueTemplateCompiler
            }
        }),
        dts({
            outDir: 'dist/vue2/types',
            include: ['src/index.type.ts'],
            entryRoot: 'src'
        }),
        // 移动类型文件：从 types/src/ 移到 types/
        moveTypesFiles(resolve(__dirname, 'dist/vue2/types')),
        // 删除 CSS 输出
        removeCssOutput(resolve(__dirname, 'dist/vue2'))
    ],
    build: {
        outDir: 'dist/vue2',
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'index.ts'),
            name: 'TinySearchBox',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format === 'es') {
                    return 'es/index.es.js'
                }
                if (format === 'cjs') {
                    return 'lib/index.cjs.js'
                }
                return 'index.js'
            }
        },
        rollupOptions: {
            external: [
                'vue',
                '@opentiny/vue-button',
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
                // 阻止输出 CSS 文件
                assetFileNames: () => {
                    // 不输出任何 CSS 文件
                    return 'ignored.css'
                }
            }
        },
        cssCodeSplit: false,
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            // 强制所有 vue 导入都解析到 vue2
            'vue$': resolve(__dirname, 'node_modules/vue2/dist/vue.esm.js'),
            'vue': resolve(__dirname, 'node_modules/vue2/dist/vue.esm.js'),
            'vue-template-compiler$': resolve(__dirname, 'node_modules/vue-template-compiler'),
            'vue-template-compiler': resolve(__dirname, 'node_modules/vue-template-compiler')
        },
        // 确保不会解析到 vue3
        dedupe: ['vue']
    },
    css: {
        postcss: {
            // Vue2 构建不使用 tailwindcss
            plugins: []
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
})

