import { resolve, dirname } from "path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 判断是否为 saas 模式
  const isSaas = mode === "saas";

  // 判断是否为开发模式
  const isDev = process.env.NODE_ENV !== 'production';

  // 调试信息
  console.log(`🔧 Vite 配置模式: ${mode}`);
  console.log(`📦 Saas 模式: ${isSaas ? "是" : "否"}`);
  console.log(`🛠️  开发模式: ${isDev ? "是" : "否"}`);

  // 根据模式配置 CSS
  // 统一通过别名 @search-box-theme 导入，不使用 additionalData
  const cssConfig = {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // Saas 模式下，限制路径解析，避免自动引入 theme/vars.less
        paths: isSaas
          ? [
            // 只包含 theme-saas 目录，不包含 theme 目录
            resolve(`../../packages/search-box/theme${isSaas ? '-saas' : ''}`),
          ]
          : [
            // 普通模式：包含 theme 目录
            resolve(`../../packages/search-box/theme${isSaas ? '-saas' : ''}`),
          ],
      },
    },
    postcss: isSaas && isDev
      ? {
        // Saas 开发模式：配置 PostCSS 处理 Tailwind
        // 使用 search-box 的 PostCSS 配置
        config: resolve(__dirname, "../../packages/search-box/postcss.config.cjs"),
      }
      : undefined,
  };

  return {
    server: {
      host: 'localhost',
      open: true
    },
    plugins: [vue()],
    css: cssConfig,
    resolve: {
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".vue", ".json"],
      alias: {
        "@demos": resolve(__dirname, "../../packages/docs/search-box"),
        "@opentiny/vue-button": resolve('node_modules/@opentiny/vue-button'),
        "@opentiny/vue-button-group": resolve('node_modules/@opentiny/vue-button-group'),
        "@opentiny/vue-checkbox": resolve('node_modules/@opentiny/vue-checkbox'),
        "@opentiny/vue-checkbox-group": resolve('node_modules/@opentiny/vue-checkbox-group'),
        "@opentiny/vue-date-picker": resolve('node_modules/@opentiny/vue-date-picker'),
        "@opentiny/vue-dropdown": resolve('node_modules/@opentiny/vue-dropdown'),
        "@opentiny/vue-dropdown-item": resolve('node_modules/@opentiny/vue-dropdown-item'),
        "@opentiny/vue-dropdown-menu": resolve('node_modules/@opentiny/vue-dropdown-menu'),
        "@opentiny/vue-form": resolve('node_modules/@opentiny/vue-form'),
        "@opentiny/vue-form-item": resolve('node_modules/@opentiny/vue-form-item'),
        "@opentiny/vue-input": resolve('node_modules/@opentiny/vue-input'),
        "@opentiny/vue-loading": resolve('node_modules/@opentiny/vue-loading'),
        "@opentiny/vue-option": resolve('node_modules/@opentiny/vue-option'),
        "@opentiny/vue-popover": resolve('node_modules/@opentiny/vue-popover'),
        "@opentiny/vue-select": resolve('node_modules/@opentiny/vue-select'),
        "@opentiny/vue-tag": resolve('node_modules/@opentiny/vue-tag'),
        "@opentiny/vue-tooltip": resolve('node_modules/@opentiny/vue-tooltip'),
        "@opentiny/vue-common": resolve('node_modules/@opentiny/vue-common'),
        "@opentiny/vue-theme": resolve(`node_modules/@opentiny/vue-theme${isSaas ? '-saas' : ''}`),
        "@opentiny/vue-icon": resolve(`node_modules/@opentiny/vue-icon${isSaas ? '-saas' : ''}`),
        "@opentiny/vue-search-box": resolve('../../packages/search-box/index.ts'),
        "@opentiny/vue-search-box-theme": resolve(`../../packages/search-box/theme${isSaas ? '-saas' : ''}/index.less`),
      }
    },
    define: {
      // 定义全局变量，用于在运行时判断模式
      "process.env.TINY_MODE": JSON.stringify(isSaas ? "saas" : "pc"),
      "process.env.TINY_THEME": JSON.stringify(isSaas ? "saas" : "tiny"),
    },
  };
});
