import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 递归遍历所有的文件，然后依次修改文件内容
const findAllFiles = (packagesPath) => {
    if (
        packagesPath.includes('.png') ||
        packagesPath.includes('.gif') ||
        packagesPath.includes('.jpeg') ||
        packagesPath.includes('.jpg') ||
        packagesPath.includes('.ttf') ||
        packagesPath.includes('node_modules') ||
        !fs.existsSync(packagesPath)
    ) {
        return
    }

    if (fs.statSync(packagesPath).isDirectory()) {
        // 循环递归查找子文件夹
        fs.readdirSync(packagesPath).forEach((childPath) => {
            findAllFiles(path.join(packagesPath, childPath))
        })
    } else {
        const content = fs.readFileSync(packagesPath).toString('UTF-8')
        let result = content
            // 替换 @opentiny 为 @aurora
            .replace(/@opentiny\/vue-renderless/g, '@aurora/renderless')
            .replace(/@opentiny\/vue-theme/g, '@aurora/theme')
            .replace(/@opentiny/g, '@aurora')
            // 替换 TINY 为 AUI
            .replace(/TINY/g, 'AUI')
            // 替换 Tiny 为 Aui
            .replace(/Tiny/g, 'Aui')
            // 替换 tiny 为 aui
            .replace(/tiny/g, 'aui')
            // 替换 tvp 前缀为 aui
            .replace(/TVP/g, 'AUI')
            .replace(/Tvp/g, 'Aui')
            .replace(/tvp-/g, 'aui-')
            .replace(/--tvp-/g, '--aui-')
            .replace(/@css-prefix:\s*tvp-/g, '@css-prefix: aui-')
            // 替换国际化键名中的 tvp
            .replace(/tvp\.tvpSearchbox/g, 'aui.auiSearchbox')
            .replace(/tvpSearchbox/g, 'auiSearchbox')
            .replace(/tvpKeyword/g, 'auiKeyword')
            // 替换对象键名中的 tvp
            .replace(/\btvp\s*:/g, 'aui:')
            // 解决TinyVue和AUI国际化键名不兼容问题
            .replace(/zhCN/g, 'zh_CN')
            .replace(/enUS/g, 'en_US')
            .replace(/-openaui/g, '-opentiny')


        fs.writeFileSync(packagesPath, result)
    }
}

// 获取 packages 目录下的路径
const pathFromPackages = (relativePath) => {
    return path.resolve(rootDir, relativePath)
}

export const releaseAurora = () => {
    const distLists = [
        'dist/vue2',
        'dist/vue2-saas',
        'dist/vue3',
        'dist/vue3-saas'
    ]

    console.log('🔄 开始转换 Aurora 版本...')

    distLists.forEach((item) => {
        const fullPath = pathFromPackages(item)
        if (fs.existsSync(fullPath)) {
            console.log(`   处理目录: ${item}`)
            findAllFiles(fullPath)
        } else {
            console.warn(`   ⚠️  目录不存在，跳过: ${item}`)
        }
    })

    console.log('✅ Aurora 版本转换完成！')
}

// 如果直接运行此脚本，则执行转换
// 检查是否作为主模块运行
const isMainModule = process.argv[1] &&
    (process.argv[1].endsWith('releaseAurora.js') ||
        fileURLToPath(import.meta.url) === process.argv[1])

if (isMainModule) {
    releaseAurora()
}

