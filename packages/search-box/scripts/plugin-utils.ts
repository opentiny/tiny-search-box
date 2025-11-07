import { resolve } from 'path'
import { existsSync, rmSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'
import type { Plugin } from 'vite'

/**
 * 清空输出目录插件
 * @param outDir 输出目录路径
 * @param dirName 目录名称（用于日志）
 */
export function clearOutputDir(outDir: string, dirName?: string): Plugin {
    return {
        name: `clear-dist-${dirName || 'output'}`,
        buildStart() {
            const outputPath = resolve(outDir)
            if (existsSync(outputPath)) {
                rmSync(outputPath, { recursive: true, force: true })
                console.log(`🗑️  已清空 ${dirName || '输出'}目录:`, outputPath)
            }
            mkdirSync(outputPath, { recursive: true })
        }
    }
}

/**
 * 删除 CSS 输出插件
 * @param outDir 输出目录（可选，用于在构建完成后删除 CSS 文件）
 */
export function removeCssOutput(outDir?: string): Plugin {
    return {
        name: 'remove-css-output',
        generateBundle(options, bundle) {
            Object.keys(bundle).forEach((fileName) => {
                if (fileName.endsWith('.css')) {
                    delete bundle[fileName]
                }
            })
        },
        writeBundle(options, bundle) {
            // 在写入阶段也删除 CSS 文件
            if (bundle) {
                Object.keys(bundle).forEach((fileName) => {
                    if (fileName.endsWith('.css')) {
                        delete bundle[fileName]
                    }
                })
            }
        },
        closeBundle() {
            if (outDir) {
                // 构建完成后删除所有 CSS 文件
                const outPath = resolve(outDir)
                const cssFiles = [
                    resolve(outPath, 'vue-search-box.css'),
                    resolve(outPath, 'ignored.css')
                ]
                cssFiles.forEach(cssFile => {
                    if (existsSync(cssFile)) {
                        rmSync(cssFile, { force: true })
                        console.log('已删除 CSS 文件:', cssFile)
                    }
                })
            }
        }
    }
}

/**
 * 移动类型文件插件：从 types/src/ 移到 types/
 * @param typesDir 类型文件目录路径
 */
export function moveTypesFiles(typesDir: string): Plugin {
    return {
        name: 'move-types-files',
        async closeBundle() {
            const typesPath = resolve(typesDir)
            const srcDir = resolve(typesPath, 'src')
            const indexPath = resolve(srcDir, 'index.type.d.ts')
            const targetPath = resolve(typesPath, 'index.type.d.ts')
            
            if (existsSync(indexPath)) {
                // 读取文件内容
                const content = readFileSync(indexPath, 'utf-8')
                // 写入到目标位置
                writeFileSync(targetPath, content, 'utf-8')
                // 删除 src 目录
                rmSync(srcDir, { recursive: true, force: true })
                console.log('已移动类型文件到 types 目录')
            }
        }
    }
}

/**
 * 复制 Less 文件插件
 * @param lessSrcPath Less 源文件路径
 * @param targetFileName 目标文件名（默认: index.less）
 */
export function copyLessFile(lessSrcPath: string, targetFileName: string = 'index.less'): Plugin {
    return {
        name: 'copy-less',
        generateBundle() {
            const lessPath = resolve(lessSrcPath)
            if (existsSync(lessPath)) {
                this.emitFile({
                    type: 'asset',
                    fileName: targetFileName,
                    source: readFileSync(lessPath, 'utf-8')
                })
            }
        }
    }
}

/**
 * 处理 Less 和 Tailwind 插件
 * @param options 配置选项
 */
export interface ProcessLessAndTailwindOptions {
    /** Less 源文件路径 */
    lessSrcPath: string
    /** 输出目录 */
    outDir: string
    /** 输出 CSS 文件名（默认: index.css） */
    cssFileName?: string
    /** PostCSS 配置文件路径 */
    postcssConfigPath: string
    /** Tailwind 配置文件路径 */
    tailwindConfigPath: string
    /** 临时文件路径（可选，默认: {outDir}/temp.css） */
    tempCssPath?: string
    /** 工作目录（用于执行命令） */
    cwd: string
}

export function processLessAndTailwind(options: ProcessLessAndTailwindOptions): Plugin {
    return {
        name: 'process-less-and-tailwind',
        async writeBundle() {
            const {
                lessSrcPath,
                outDir,
                cssFileName = 'index.css',
                postcssConfigPath,
                tailwindConfigPath,
                tempCssPath,
                cwd
            } = options

            const lessPath = resolve(lessSrcPath)
            const outputDir = resolve(outDir)
            const tempCss = tempCssPath ? resolve(tempCssPath) : resolve(outputDir, 'temp.css')
            const cssDest = resolve(outputDir, cssFileName)
            const postcssConfig = resolve(postcssConfigPath)
            const tailwindConfig = resolve(tailwindConfigPath)
            const workDir = resolve(cwd)

            if (!existsSync(lessPath)) {
                console.warn('⚠️ Less 源文件不存在:', lessPath)
                return
            }

            // 清空输出目录（如果存在）
            if (existsSync(outputDir)) {
                rmSync(outputDir, { recursive: true, force: true })
                console.log('🗑️  已清空输出目录:', outputDir)
            }

            // 重新创建输出目录
            mkdirSync(outputDir, { recursive: true })

            try {
                console.log('📝 步骤1: 编译 Less 文件...')
                // 步骤1：使用 lessc 编译 Less 到临时 CSS
                execSync(`npx lessc "${lessPath}" "${tempCss}"`, {
                    stdio: 'pipe',
                    cwd: workDir,
                    shell: true as any
                })
                console.log('✓ Less 编译完成')

                // 读取编译后的 CSS
                let tempCssContent = readFileSync(tempCss, 'utf-8')

                // 步骤2：修复 Less 编译后的 @apply 指令（将逗号替换为空格）
                console.log('🔧 步骤2: 修复 @apply 指令...')
                // 修复 @apply 指令中的逗号问题：@apply w-2, h-2; -> @apply w-2 h-2;
                tempCssContent = tempCssContent.replace(/@apply\s+([^;]+),/g, (match, classes) => {
                    // 将逗号替换为空格，并移除多余的逗号
                    const cleaned = classes.replace(/,\s*/g, ' ').trim()
                    return `@apply ${cleaned}`
                })
                writeFileSync(tempCss, tempCssContent, 'utf-8')
                console.log('✓ @apply 指令修复完成')

                // 步骤3：使用 postcss 处理 Tailwind（处理 @apply 指令）
                console.log('🎨 步骤3: 使用 PostCSS 处理 Tailwind...')
                const postcssCmd = `npx postcss "${tempCss}" -o "${cssDest}" --config "${postcssConfig}"`
                console.log('执行命令:', postcssCmd)

                execSync(postcssCmd, {
                    stdio: 'inherit',
                    cwd: workDir,
                    shell: true as any,
                    env: {
                        ...process.env,
                        // 设置 Tailwind 配置文件路径（PostCSS 会读取这个环境变量）
                        TAILWIND_CONFIG: tailwindConfig
                    }
                } as any)

                // 步骤4：验证输出文件
                if (!existsSync(cssDest)) {
                    throw new Error(`CSS 文件未生成: ${cssDest}`)
                }

                const cssContent = readFileSync(cssDest, 'utf-8')
                if (!cssContent || cssContent.trim().length === 0) {
                    throw new Error('生成的 CSS 文件为空')
                }

                console.log(`✓ CSS 文件已生成: ${cssDest} (${Math.round(cssContent.length / 1024)} KB)`)

                // 步骤5：删除临时文件
                if (existsSync(tempCss)) {
                    unlinkSync(tempCss)
                    console.log('✓ 临时文件已清理')
                }
            } catch (error: any) {
                console.error('❌ CSS 编译失败:', error.message)
                if (error.stdout) {
                    console.error('stdout:', error.stdout.toString())
                }
                if (error.stderr) {
                    console.error('stderr:', error.stderr.toString())
                }
                // 不要删除 temp.css，方便调试
                throw error
            }
        }
    }
}

/**
 * 删除 JS 输出插件
 */
export function removeJsOutput(): Plugin {
    return {
        name: 'remove-js-output',
        generateBundle(options, bundle) {
            // 删除所有 JS 文件
            Object.keys(bundle).forEach((fileName) => {
                if (fileName.endsWith('.js') || fileName.endsWith('.mjs')) {
                    delete bundle[fileName]
                }
            })
        }
    }
}

