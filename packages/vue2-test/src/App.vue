<script>
import Vue from "vue";
import TinySearchBox from "@opentiny/vue-search-box";

import TinyRadioGroup from "@opentiny/vue-radio-group";
import demosData from "@demos/webdoc/search-box.js";

export default {
  name: "App",
  components: {
    TinyRadioGroup,
    TinySearchBox,
  },
  data() {
    return {
      activeDemoId: "basic-usage",
      language: "zh-CN",
      options: [
        { label: "zh-CN", text: "中文" },
        { label: "en-US", text: "English" },
      ],
      currentComponent: null,
      demosData: demosData,
      vueComponents: {},
    };
  },
  computed: {
    activeDemo() {
      return (
        demosData.demos.find((demo) => demo.demoId === this.activeDemoId) ||
        demosData.demos[0]
      );
    },
  },
  watch: {
    language(newLang) {
      if (this.$i18n) {
        this.$i18n.locale = newLang;
        // Vue 2 中需要强制更新组件以触发国际化切换
        this.$forceUpdate();
      }
    },
    "$i18n.locale": {
      handler(newLocale) {
        if (this.language !== newLocale) {
          this.language = newLocale;
          // Vue 2 中需要强制更新组件以触发国际化切换
          this.$forceUpdate();
        }
      },
      immediate: true,
    },
    activeDemoId: {
      handler(newDemoId) {
        // 确保 vueComponents 已经初始化后再加载组件
        if (Object.keys(this.vueComponents).length > 0) {
          this.loadDemoComponent(newDemoId);
        } else {
          // 如果还没初始化，等待一下再加载
          this.$nextTick(() => {
            this.loadDemoComponent(newDemoId);
          });
        }
      },
      immediate: false, // 改为 false，在 created 中手动触发
    },
  },
  created() {
    // 同步语言初始值
    if (this.$i18n) {
      this.language = this.$i18n.locale || "zh-CN";
    }

    // 批量导入vue组件示例文件（只加载 options-api 版本）
    // 注意：import.meta.glob 不支持别名，必须使用相对路径
    // 从 packages/vue2-test/src/App.vue 到 packages/docs/search-box 的相对路径是 ../../docs/search-box
    // vue2-test 使用 options-api 版本的组件
    const vueFiles = import.meta.glob(
      [
        "@demos/*-options-api.vue", // 只加载 options-api 版本
      ],
      {
        eager: false,
      }
    );

    // 创建组件映射对象，key 为文件名（不包含 -options-api 后缀）
    const vueComponents = Object.create(null);
    for (const path in vueFiles) {
      if (Object.prototype.hasOwnProperty.call(vueFiles, path)) {
        // 提取文件名作为 key（去掉 -options-api 后缀）
        const pathArr = path.split("/");
        const fileName = pathArr[pathArr.length - 1];
        // 将文件名从 xxx-options-api.vue 转换为 xxx.vue
        const baseFileName = fileName.replace("-options-api.vue", ".vue");
        vueComponents[baseFileName] = vueFiles[path];
      }
    }

    // 保存到 data 中
    this.vueComponents = vueComponents;

    // 确保组件映射已保存后再加载组件
    this.$nextTick(() => {
      this.loadDemoComponent(this.activeDemoId);
    });
  },
  methods: {
    // 批量导入vue组件示例文件（只加载 options-api 版本）
    async loadDemoComponent(demoId) {
      const demo = this.demosData.demos.find((d) => d.demoId === demoId);

      if (demo && demo.codeFiles && demo.codeFiles.length > 0) {
        // codeFiles 的第一个文件通常是主组件文件
        const componentFile = demo.codeFiles[0];

        // 确保是 options-api 版本
        if (componentFile.includes("-options-api.vue")) {
          this.currentComponent = {
            render: (h) =>
              h(
                "div",
                {},
                `配置文件错误：${componentFile} 已经是 options-api 版本，应该使用不带 options-api 的版本`
              ),
          };
          return;
        }

        // 在 vueComponents 中查找对应的组件
        // 例如：basic-usage.vue -> 在 vueComponents 中查找 basic-usage.vue（已经映射到 basic-usage-options-api.vue）
        const demoName = componentFile;

        if (this.vueComponents[demoName]) {
          try {
            // 动态导入 options-api 版本
            const module = await this.vueComponents[demoName]();
            this.currentComponent = module.default || module;
          } catch (error) {
            this.currentComponent = {
              render: (h) =>
                h(
                  "div",
                  {},
                  `${demoName}示例资源不存在，请检查文件名是否正确？错误: ${error.message}`
                ),
            };
          }
        } else {
          this.currentComponent = {
            render: (h) =>
              h(
                "div",
                {},
                `${demoName}示例资源不存在，请检查是否正确配置了 options-api 版本？可用组件: ${Object.keys(
                  this.vueComponents
                ).join(", ")}`
              ),
          };
        }
      } else {
        console.warn("⚠️ demo 或 codeFiles 为空");
        this.currentComponent = null;
      }
    },
    switchDemo(demoId) {
      this.activeDemoId = demoId;
    },
    getDemoName(demo) {
      return demo.name[this.language] || demo.name["zh-CN"] || demo.demoId;
    },
    getDemoDesc(demo) {
      return demo.desc[this.language] || demo.desc["zh-CN"] || "";
    },
  },
};
</script>

<template>
  <div class="demo-container">
    <!-- 头部 -->
    <header class="demo-header">
      <div class="header-content">
        <h1 class="header-title">
          Vue2 : TinySearchBox {{ language === "zh-CN" ? "示例" : "Example" }}
        </h1>
        <div class="header-actions">
          <tiny-radio-group
            v-model="language"
            type="button"
            :options="options"
          ></tiny-radio-group>
        </div>
      </div>
    </header>

    <div class="demo-body">
      <!-- 左侧菜单 -->
      <aside class="demo-sidebar">
        <nav class="demo-nav">
          <div
            v-for="demo in demosData.demos"
            :key="demo.demoId"
            class="demo-nav-item"
            :class="{ active: activeDemoId === demo.demoId }"
            @click="switchDemo(demo.demoId)"
          >
            <div class="demo-nav-item-title">{{ getDemoName(demo) }}</div>
          </div>
        </nav>
      </aside>

      <!-- 右侧内容区域 -->
      <main class="demo-main">
        <div class="demo-content">
          <div class="demo-preview">
            <div class="demo-title">
              <h2>{{ getDemoName(activeDemo) }}</h2>
              <p class="demo-description">{{ getDemoDesc(activeDemo) }}</p>
            </div>
            <component :is="currentComponent" v-if="currentComponent" />
            <div v-else class="loading">加载中...</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.demo-header {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #191919;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.lang-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.lang-btn.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.demo-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.demo-sidebar {
  width: 280px;
  background: #fafafa;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  flex-shrink: 0;
}

.demo-nav {
  padding: 16px 0;
}

.demo-nav-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-left: 3px solid transparent;
}

.demo-nav-item:hover {
  background: #f0f0f0;
}

.demo-nav-item.active {
  background: #e6f7ff;
  border-left-color: #1890ff;
}

.demo-nav-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #191919;
  margin-bottom: 4px;
}

.demo-nav-item.active .demo-nav-item-title {
  color: #1890ff;
}

.demo-nav-item-desc {
  font-size: 12px;
  color: #808080;
  line-height: 1.4;
}

.demo-main {
  flex: 1;
  overflow-y: auto;
  background: #fff;
}

.demo-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-title {
  margin-bottom: 24px;
  text-align: left;
}

.demo-title h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #191919;
}

.demo-description {
  margin: 0;
  font-size: 14px;
  color: #808080;
  line-height: 1.6;
}

.demo-preview {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 24px;
  min-height: 300px;
  color: #191919;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #808080;
}

/* 滚动条样式 */
.demo-sidebar::-webkit-scrollbar,
.demo-main::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
</style>
