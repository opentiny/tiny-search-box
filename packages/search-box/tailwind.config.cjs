// 使用 @opentiny/vue-theme-saas 的 Tailwind 配置
// 这样可以支持自定义类名，如 bg-color-text-disabled 等
const { resolve } = require('path')

let tailwindConfig

try {
  // 尝试使用 @opentiny/vue-theme-saas 的 Tailwind 配置
  const themeSaasConfig = require('@opentiny/vue-theme-saas/tailwind.config.js')
  
  // 扩展配置，确保包含我们的文件
  // 使用绝对路径，确保在不同工作目录下都能正确解析
  const cwd = process.cwd()
  tailwindConfig = {
    ...themeSaasConfig,
    content: [
      // 保留原有的 content 配置
      ...(Array.isArray(themeSaasConfig.content) ? themeSaasConfig.content : []),
      // 添加我们的文件路径（使用 glob 模式，支持相对路径）
      './theme-saas/**/*.less',
      './src/**/*.{vue,ts,js}',
      // 也可以添加绝对路径作为备选
      resolve(__dirname, 'theme-saas/**/*.less'),
      resolve(__dirname, 'src/**/*.{vue,ts,js}')
    ]
  }
  
  // 调试信息
  if (process.env.DEBUG) {
    console.log('✓ 使用 @opentiny/vue-theme-saas 的 Tailwind 配置')
    console.log('Content 路径数量:', tailwindConfig.content.length)
    console.log('当前工作目录:', cwd)
  }
} catch (error) {
  // 如果找不到，使用基础配置
  tailwindConfig = {
    content: [
      resolve(__dirname, 'theme-saas/**/*.less'),
      resolve(__dirname, 'src/**/*.{vue,ts,js}')
    ],
    theme: {
      extend: {
        // 可以在这里扩展 Tailwind 配置
      }
    },
    plugins: [],
    corePlugins: {
      // 保留所有核心插件
    }
  }
  console.warn('⚠️ 未找到 @opentiny/vue-theme-saas 配置，使用基础配置')
  console.warn('错误:', error.message)
}

module.exports = tailwindConfig
