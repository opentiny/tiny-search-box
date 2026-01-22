import { resolve, dirname } from "path";
import { fileURLToPath } from "node:url";
import { createRequire } from "module";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

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
    postcss: isSaas
      ? (() => {
        // Saas 模式：直接加载 PostCSS 配置并应用插件
        const postcssConfigPath = resolve(__dirname, "../../packages/search-box/postcss.config.cjs");
        const postcssConfig = require(postcssConfigPath);
        return postcssConfig;
      })()
      : {
        // 普通模式：禁用 PostCSS，避免自动查找 postcss.config.cjs
        plugins: []
      },
  };

  return {
    server: {
      host: 'localhost',
      open: true
    },
    plugins: [vue()],
    css: cssConfig,
    // 配置依赖预构建，确保 @opentiny/vue 正确预构建
    optimizeDeps: {
      include: ['@opentiny/vue', '@opentiny/vue-common'],
      exclude: ['@opentiny/vue-search-box']
    },
    resolve: {
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".vue", ".json"],
      alias: {
        "@demos": resolve(__dirname, "../../packages/docs/search-box"),
        "@opentiny/vue": resolve('node_modules/@opentiny/vue'),
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
