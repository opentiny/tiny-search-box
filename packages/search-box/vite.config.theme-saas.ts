import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyLessFile, processLessAndTailwind, removeJsOutput } from './scripts/plugin-utils'
import { writeFileSync, readFileSync } from 'fs'

// 生成 package.json 的插件
function generatePackageJsonPlugin() {
    return {
        name: 'generate-package-json',
        writeBundle() {
            const rootDir = resolve(__dirname)
            const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))

            const themeSaasPackageJson = {
                name: '@opentiny/vue-search-box-theme-saas',
                version: packageJson.version, // theme-saas 版本与主版本一致
                description: 'Saas theme styles for @opentiny/vue-search-box',
                main: 'index.css',
                files: ['index.css'],
                sideEffects: ['*.css'],
                publishConfig: {
                    access: 'public'
                },
                keywords: [...(packageJson.keywords || []), 'theme', 'css', 'styles', 'saas'],
                license: packageJson.license,
                repository: packageJson.repository,
                homepage: packageJson.homepage,
                bugs: packageJson.bugs
            }

            const distDir = resolve(__dirname, 'dist/theme-saas')
            writeFileSync(resolve(distDir, 'package.json'), JSON.stringify(themeSaasPackageJson, null, 2), 'utf-8')
            console.log(`✅ 已生成 package.json: ${resolve(distDir, 'package.json')}`)
        }
    }
}

export default defineConfig({
    plugins: [
        // 自定义插件：复制 less 文件到输出目录
        copyLessFile(resolve(__dirname, 'theme-saas/index.less')),
        // 自定义插件：先编译 Less，再用 PostCSS 处理 Tailwind
        processLessAndTailwind({
            lessSrcPath: resolve(__dirname, 'theme-saas/index.less'),
            outDir: resolve(__dirname, 'dist/theme-saas'),
            cssFileName: 'index.css',
            postcssConfigPath: resolve(__dirname, 'postcss.config.cjs'),
            tailwindConfigPath: resolve(__dirname, 'tailwind.config.cjs'),
            cwd: __dirname
        }),
        // 自定义插件：删除 JS 输出
        removeJsOutput(),
        // 生成 package.json
        generatePackageJsonPlugin()
    ],
    build: {
        outDir: 'dist/theme-saas',
        emptyOutDir: true,
        cssCodeSplit: false,
        cssMinify: false, // 由 PostCSS 处理压缩
        rollupOptions: {
            // 入口文件，只导入 CSS
            input: 'theme-saas/index.less',
            output: {
                // 只输出 CSS 文件
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'index.css'
                    }
                    if (assetInfo.name && assetInfo.name.endsWith('.less')) {
                        return 'index.less'
                    }
                    return assetInfo.name || 'asset'
                },
                // 不输出 JS 文件
                entryFileNames: '[name].js'
            }
        }
    },
    css: {
        // 禁用 Vite 的所有 CSS 处理（包括 Less 和 PostCSS）
        // 我们在自定义插件中手动处理
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        },
        postcss: undefined
    },
    // 禁用 CSS 处理，避免 Vite 尝试处理 Less 文件
    esbuild: {
        loader: 'ts',
        include: /\.ts$/
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
})
