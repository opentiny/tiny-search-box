<script setup>
import { ref, computed, defineAsyncComponent, shallowRef, watch, h } from "vue";
import { useI18n } from "vue-i18n";
import ConfigProvider from "@opentiny/vue-config-provider";
import designSaasConfig from "@opentiny/vue-design-saas";
import TinyRadioGroup from "@opentiny/vue-radio-group";
import demosData from "@demos/webdoc/search-box.js";

const { locale } = useI18n();

const activeDemoId = ref("basic-usage");
// 同步语言初始值
const language = ref(locale.value || "zh-CN");

// 监听语言变化，更新 i18n locale
watch(language, (newLang) => {
  locale.value = newLang;
});

// 监听 i18n locale 变化，同步到 language（双向同步）
watch(
  locale,
  (newLocale) => {
    if (language.value !== newLocale) {
      language.value = newLocale;
    }
  },
  { immediate: true }
);

const options = ref([
  { label: "zh-CN", text: "中文" },
  { label: "en-US", text: "English" },
]);

// 批量导入vue组件示例文件（排除 options-api 版本）
// 注意：@demos 别名指向 packages/docs/search-box，所以路径是 @demos/*.vue
// 使用否定模式排除所有 options-api 文件
const vueFiles = import.meta.glob(
  [
    "@demos/*.vue",
    "!@demos/*-options-api.vue", // 排除所有 options-api 版本
  ],
  {
    eager: false,
  }
);

// 创建组件映射对象，key 为文件名
const vueComponents = Object.create(null);
for (const path in vueFiles) {
  if (Object.prototype.hasOwnProperty.call(vueFiles, path)) {
    // 双重检查：确保不包含 options-api（虽然 glob 已排除，但为了安全）
    if (path.includes("-options-api.vue")) {
      continue;
    }
    // 提取文件名作为 key
    const pathArr = path.split("/");
    const fileName = pathArr[pathArr.length - 1];
    vueComponents[fileName] = vueFiles[path];
  }
}

// 获取当前选中的示例
const activeDemo = computed(() => {
  return (
    demosData.demos.find((demo) => demo.demoId === activeDemoId.value) ||
    demosData.demos[0]
  );
});

// 当前动态组件
const currentComponent = shallowRef(null);

// 根据 demoId 动态加载组件文件
const loadDemoComponent = async (demoId) => {
  const demo = demosData.demos.find((d) => d.demoId === demoId);
  if (demo && demo.codeFiles && demo.codeFiles.length > 0) {
    // codeFiles 的第一个文件通常是主组件文件
    const componentFile = demo.codeFiles[0];

    // 确保不是 options-api 版本
    if (componentFile.includes("-options-api.vue")) {
      console.warn(`跳过 options-api 版本: ${componentFile}`);
      currentComponent.value = h(
        "div",
        {},
        `配置文件错误：${componentFile} 是 options-api 版本，应该使用不带 options-api 的版本`
      );
      return;
    }

    const demoName = componentFile;

    if (vueComponents[demoName]) {
      try {
        const module = await vueComponents[demoName]();
        currentComponent.value = module.default || module;
      } catch (error) {
        console.error(`加载组件 ${demoName} 失败:`, error);
        currentComponent.value = h(
          "div",
          {},
          `${demoName}示例资源不存在，请检查文件名是否正确？`
        );
      }
    } else {
      currentComponent.value = h(
        "div",
        {},
        `${demoName}示例资源不存在，请检查文件名是否正确？`
      );
    }
  } else {
    currentComponent.value = null;
  }
};

// 监听 activeDemoId 变化，加载对应组件
watch(
  activeDemoId,
  (newDemoId) => {
    loadDemoComponent(newDemoId);
  },
  { immediate: true }
);

// 切换示例
const switchDemo = (demoId) => {
  activeDemoId.value = demoId;
};

// 获取示例名称
const getDemoName = (demo) => {
  return demo.name[language.value] || demo.name["zh-CN"] || demo.demoId;
};

// 获取示例描述
const getDemoDesc = (demo) => {
  return demo.desc[language.value] || demo.desc["zh-CN"] || "";
};
</script>

<template>
  <ConfigProvider :config="designSaasConfig">
    <div class="demo-container">
      <!-- 头部 -->
      <header class="demo-header">
        <div class="header-content">
          <h1 class="header-title">
            Vue3 : TinySearchBox {{ language === "zh-CN" ? "示例" : "Example" }}
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
              <Suspense>
                <template #default>
                  <component :is="currentComponent" v-if="currentComponent" />
                </template>
                <template #fallback>
                  <div class="loading">加载中...</div>
                </template>
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  </ConfigProvider>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  text-align: left;
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
