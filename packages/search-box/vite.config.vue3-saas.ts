import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { clearOutputDir, moveTypesFiles, includeStyle, autoImportStyle } from "./scripts/plugin-utils"

export default defineConfig({
    plugins: [
        // 构建前清空输出目录
        clearOutputDir(resolve(__dirname, "dist/vue3-saas"), "Vue3-Saas"),
        vue(),
        dts({
            outDir: "dist/vue3-saas/types",
            include: ["src/index.type.ts"],
            entryRoot: "vue3",
        }),
        // 移动类型文件：从 types/src/ 移到 types/
        moveTypesFiles(resolve(__dirname, "dist/vue3-saas/types")),
        // 包含 Saas 主题样式
        includeStyle({
            lessSrcPath: resolve(__dirname, "theme-saas/index.less"),
            outDir: resolve(__dirname, "dist/vue3-saas"),
            cssFileName: "index.css",
            isSaas: true,
            postcssConfigPath: resolve(__dirname, "postcss.config.cjs"),
            tailwindConfigPath: resolve(__dirname, "tailwind.config.cjs"),
            cwd: __dirname
        }),
        // 自动导入样式
        autoImportStyle('./index.css', resolve(__dirname, "dist/vue3-saas"))
    ],
    resolve: {
        alias: {
            'vue': resolve("node_modules/vue/dist/vue.esm.js"),
            vue$: resolve("node_modules/vue/dist/vue.esm.js"),
        },
    },
    build: {
        outDir: "dist/vue3-saas",
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, "index.ts"),
            name: "TinySearchBox",
            formats: ["es"],
            fileName: () => "index.js",
        },
        rollupOptions: {
            external: [
                "vue",
                "@opentiny/vue-button",
                "@opentiny/vue-button-group",
                "@opentiny/vue-checkbox",
                "@opentiny/vue-checkbox-group",
                "@opentiny/vue-date-picker",
                "@opentiny/vue-dropdown",
                "@opentiny/vue-dropdown-item",
                "@opentiny/vue-dropdown-menu",
                "@opentiny/vue-form",
                "@opentiny/vue-form-item",
                "@opentiny/vue-icon",
                "@opentiny/vue-input",
                "@opentiny/vue-loading",
                "@opentiny/vue-option",
                "@opentiny/vue-popover",
                "@opentiny/vue-select",
                "@opentiny/vue-tag",
                "@opentiny/vue-tooltip",
                "@opentiny/vue-common",
                "@opentiny/vue-theme",
            ],
            output: {
                globals: {
                    vue: "Vue",
                },
                // 允许输出 CSS 文件
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'index.css'
                    }
                    return assetInfo.name || 'asset'
                },
            },
        },
        cssCodeSplit: false,
        sourcemap: true,
    },

    css: {
        // Saas 主题需要 PostCSS 处理 Tailwind，但我们在插件中处理
        postcss: {
            plugins: [],
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
});

