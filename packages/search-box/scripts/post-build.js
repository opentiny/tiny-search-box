import { resolve } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// 读取 package.json
const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf-8'))

// 从命令行参数获取构建类型
const buildType = process.argv[2] // 'vue2', 'vue3', 'saas'

// 解析版本号，提取 minor 和 patch 版本
// 例如：3.27.0 -> { major: 3, minor: 27, patch: 0 }
function parseVersion(version) {
  const parts = version.split('.')
  return {
    major: parseInt(parts[0] || '0', 10),
    minor: parseInt(parts[1] || '0', 10),
    patch: parseInt(parts[2] || '0', 10)
  }
}

// 生成版本号字符串
function formatVersion(major, minor, patch) {
  return `${major}.${minor}.${patch}`
}

// 获取 Vue2 版本号（2.xx）
function getVue2Version() {
  const mainVersion = parseVersion(packageJson.version)
  return formatVersion(2, mainVersion.minor, mainVersion.patch)
}

// 获取 Vue3 版本号（与主版本一致）
function getVue3Version() {
  return packageJson.version
}

// 生成 Vue2 的 package.json
function generateVue2PackageJson() {
  return {
    name: packageJson.name,
    version: getVue2Version(),
    description: packageJson.description,
    main: 'lib/index.cjs.js',
    module: 'es/index.es.js',
    types: 'types/index.d.ts',
    sideEffects: false,
    publishConfig: {
      access: 'public'
    },
    peerDependencies: {
      vue: '^2.6.14'
    },
    dependencies: {
      '@opentiny/vue-button': '^2.26.0',
      '@opentiny/vue-checkbox': '^2.26.0',
      '@opentiny/vue-checkbox-group': '^2.26.0',
      '@opentiny/vue-date-picker': '^2.26.0',
      '@opentiny/vue-dropdown': '^2.26.0',
      '@opentiny/vue-dropdown-item': '^2.26.0',
      '@opentiny/vue-dropdown-menu': '^2.26.0',
      '@opentiny/vue-form': '^2.26.0',
      '@opentiny/vue-form-item': '^2.26.0',
      '@opentiny/vue-icon': '^2.26.0',
      '@opentiny/vue-input': '^2.26.0',
      '@opentiny/vue-loading': '^2.26.0',
      '@opentiny/vue-option': '^2.26.0',
      '@opentiny/vue-popover': '^2.26.0',
      '@opentiny/vue-select': '^2.26.0',
      '@opentiny/vue-tag': '^2.26.0',
      '@opentiny/vue-tooltip': '^2.26.0',
      '@opentiny/vue-common': '^2.26.0',
      '@opentiny/vue-theme': '^3.26.0'
    },
    keywords: packageJson.keywords || [],
    license: packageJson.license,
    repository: packageJson.repository,
    homepage: packageJson.homepage,
    bugs: packageJson.bugs
  }
}

// 生成 Vue3 的 package.json
function generateVue3PackageJson() {
  return {
    name: packageJson.name,
    version: getVue3Version(),
    description: packageJson.description,
    main: 'lib/index.cjs.js',
    module: 'es/index.es.js',
    types: 'types/index.d.ts',
    sideEffects: false,
    publishConfig: {
      access: 'public'
    },
    peerDependencies: {
      vue: '^3.0.0'
    },
    dependencies: {
      '@opentiny/vue-button': '^3.26.0',
      '@opentiny/vue-checkbox': '^3.26.0',
      '@opentiny/vue-checkbox-group': '^3.26.0',
      '@opentiny/vue-date-picker': '^3.26.0',
      '@opentiny/vue-dropdown': '^3.26.0',
      '@opentiny/vue-dropdown-item': '^3.26.0',
      '@opentiny/vue-dropdown-menu': '^3.26.0',
      '@opentiny/vue-form': '^3.26.0',
      '@opentiny/vue-form-item': '^3.26.0',
      '@opentiny/vue-icon': '^3.26.0',
      '@opentiny/vue-input': '^3.26.0',
      '@opentiny/vue-loading': '^3.26.0',
      '@opentiny/vue-option': '^3.26.0',
      '@opentiny/vue-popover': '^3.26.0',
      '@opentiny/vue-select': '^3.26.0',
      '@opentiny/vue-tag': '^3.26.0',
      '@opentiny/vue-tooltip': '^3.26.0',
      '@opentiny/vue-common': '^3.26.0',
      '@opentiny/vue-theme': '^3.26.0'
    },
    keywords: packageJson.keywords || [],
    license: packageJson.license,
    repository: packageJson.repository,
    homepage: packageJson.homepage,
    bugs: packageJson.bugs
  }
}

// 根据构建类型生成对应的 package.json
function generatePackageJson() {
  let pkg = null
  let distDir = ''

  if (buildType === 'vue2') {
    pkg = generateVue2PackageJson()
    distDir = resolve(rootDir, 'dist/vue2')
    // 不再复制和编译 CSS 文件，CSS 由单独的 theme 构建处理
  } else if (buildType === 'vue3') {
    pkg = generateVue3PackageJson()
    distDir = resolve(rootDir, 'dist/vue3')
  } else {
    console.error(`未知的构建类型: ${buildType}`)
    process.exit(1)
  }

  if (!existsSync(distDir)) {
    console.error(`构建目录不存在: ${distDir}`)
    console.error('请先运行构建命令')
    process.exit(1)
  }

  const packageJsonPath = resolve(distDir, 'package.json')
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf-8')
  console.log(`已生成 package.json: ${packageJsonPath}`)
}

generatePackageJson()
