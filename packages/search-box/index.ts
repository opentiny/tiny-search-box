/**
 * Copyright (c) 2022 - present TinyVue Authors.
 * Copyright (c) 2022 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */

import TinySearchBox from "./src/index";
import { t, setGlobalApp } from './src/utils/i18n'
import zhCN from './src/utils/zh_CN'
import enUS from './src/utils/en_US'
import TinySearchBoxFirstLevelPanel from './src/components/first-level-panel.vue'
import TinySearchBoxSecondLevelPanel from './src/components/second-level-panel.vue'
import { version } from "./package.json";
// model 配置已在组件内部定义，无需重复设置

/* istanbul ignore next */
TinySearchBox.install = function (Vue) {
  const runtime: any = Vue

  // Vue3 app instance: install(app)
  if (runtime && runtime.config && runtime.config.globalProperties) {
    setGlobalApp(runtime)
  }

  // Vue2 constructor: install(Vue)
  // Capture a runtime vm/root with i18n once available, so users don't need setGlobalApp manually.
  if (runtime && runtime.mixin && !runtime.__TINY_SEARCH_BOX_I18N_MIXIN__) {
    runtime.__TINY_SEARCH_BOX_I18N_MIXIN__ = true
    runtime.mixin({
      beforeCreate() {
        const vm = this as any
        if (vm && (vm.$i18n || vm.$t || (vm.$root && (vm.$root.$i18n || vm.$root.$t)))) {
          setGlobalApp(vm.$root || vm)
        }
      }
    })
  }

  runtime.component(TinySearchBox.name, TinySearchBox);
};

TinySearchBox.version = version;

/* istanbul ignore next */
if (typeof window !== "undefined" && (window as typeof window & { Vue?: unknown }).Vue) {
  TinySearchBox.install((window as typeof window & { Vue: any }).Vue);
}

// 导出
export * from './src/index.type'
export { zhCN, enUS, t, setGlobalApp, TinySearchBoxFirstLevelPanel, TinySearchBoxSecondLevelPanel }

export default TinySearchBox;
