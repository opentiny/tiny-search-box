// PostCSS 配置文件
// 使用 CommonJS 格式以兼容 Tailwind 配置和 @opentiny/vue-theme-saas
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const { resolve } = require('path')
// 获取 Tailwind 配置文件的绝对路径
const tailwindConfigPath = resolve(__dirname, 'tailwind.config.cjs')
module.exports = {
  plugins: [
    // PostCSS 处理顺序：
    // 1. 先处理 Tailwind（展开 @apply 指令）
    // 2. 然后处理 Autoprefixer（添加浏览器前缀）
    tailwindcss(tailwindConfigPath),
    autoprefixer(),
  ],
}

