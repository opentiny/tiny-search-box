import { execFileSync } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync, readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))
const version = packageJson.version

// 发布配置
const publishConfigs = [
  {
    name: 'Vue2',
    dir: 'dist/vue2',
    packageJson: resolve(rootDir, 'dist/vue2/package.json')
  },
  {
    name: 'Vue2-Saas',
    dir: 'dist/vue2-saas',
    packageJson: resolve(rootDir, 'dist/vue2-saas/package.json')
  },
  {
    name: 'Vue3',
    dir: 'dist/vue3',
    packageJson: resolve(rootDir, 'dist/vue3/package.json')
  },
  {
    name: 'Vue3-Saas',
    dir: 'dist/vue3-saas',
    packageJson: resolve(rootDir, 'dist/vue3-saas/package.json')
  }
]

// 发布函数
function publish(config) {
  const distPath = resolve(rootDir, config.dir)

  if (!existsSync(distPath)) {
    console.error(`❌ 目录不存在: ${distPath}`)
    console.error(`   请先运行构建命令`)
    return false
  }

  if (!existsSync(config.packageJson)) {
    console.error(`❌ package.json 不存在: ${config.packageJson}`)
    console.error(`   请先运行构建命令生成 package.json`)
    return false
  }

  try {
    console.log(`\n📦 正在发布 ${config.name}...`)
    console.log(`   目录: ${distPath}`)

    // 切换到发布目录
    process.chdir(distPath)

    // npm 11 要求低于已有稳定版本的发布和预发布显式指定 dist-tag。
    // 按实际产物版本选择渠道，确保 Vue2/Vue3 均使用明确的标签。
    const { version: publishVersion } = JSON.parse(readFileSync(config.packageJson, 'utf-8'))
    const prerelease = publishVersion.split('+')[0].split('-').slice(1).join('-')
    const distTag = prerelease ? prerelease.split('.')[0] : 'latest'
    if (!/^[a-zA-Z][0-9A-Za-z-]*$/.test(distTag)) {
      throw new Error(`无法从版本 ${publishVersion} 推导有效的发布渠道`)
    }
    console.log(`   dist-tag: ${distTag}`)

    // 使用独立参数，避免将版本派生值作为 shell 命令执行。
    execFileSync('npm', ['publish', '--access', 'public', '--tag', distTag], {
      stdio: 'inherit',
      cwd: distPath
    })

    console.log(`✅ ${config.name} 发布成功！`)
    return true
  } catch (error) {
    console.error(`❌ ${config.name} 发布失败:`, error.message)
    return false
  } finally {
    // 切换回根目录
    process.chdir(rootDir)
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2)
  const target = args[0] // vue2, vue2-saas, vue3, vue3-saas, all

  console.log(`\n🚀 开始发布流程...`)
  console.log(`   版本: ${version}`)
  console.log(`   目标: ${target || 'all'}\n`)

  let targets = []

  if (!target || target === 'all') {
    targets = publishConfigs
  } else {
    const targetMap = {
      'vue2': publishConfigs[0],
      'vue2-saas': publishConfigs[1],
      'vue3': publishConfigs[2],
      'vue3-saas': publishConfigs[3]
    }

    const selected = targetMap[target]
    if (!selected) {
      console.error(`❌ 未知的发布目标: ${target}`)
      console.error(`   可用目标: vue2, vue2-saas, vue3, vue3-saas, all`)
      process.exit(1)
    }
    targets = [selected]
  }

  const results = []
  for (const config of targets) {
    const success = publish(config)
    results.push({ name: config.name, success })
  }

  // 输出结果摘要
  console.log(`\n📊 发布结果摘要:`)
  results.forEach(({ name, success }) => {
    console.log(`   ${success ? '✅' : '❌'} ${name}`)
  })

  const allSuccess = results.every(r => r.success)
  if (!allSuccess) {
    process.exit(1)
  }

  console.log(`\n🎉 所有包发布完成！`)
}

main()


