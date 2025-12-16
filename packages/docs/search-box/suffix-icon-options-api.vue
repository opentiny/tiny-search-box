<template>
  <div class="demo-suffix-icon">
    <div class="demo-box">
      <div class="demo-title">默认显示前缀搜索图标</div>
      <tiny-search-box
        v-model="tags1"
        :items="items"
        :show-help="false"
      />
    </div>
    <div class="demo-box">
      <div class="demo-title">隐藏前缀搜索图标</div>
      <tiny-search-box
        v-model="tags2"
        :items="items"
        :show-prefix-icon="false"
        :show-help="false"
      />
    </div>
    <div class="demo-box">
      <div class="demo-title">使用自定义后缀图标插槽</div>
      <tiny-search-box
        v-model="tags3"
        :items="items"
        :show-prefix-icon="false"
        :show-help="false"
      >
        <template #suffix-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            xml:space="preserve"
            class="tiny-svg custom-suffix-icon"
            isSvg="true"
            @click.stop="handleSuffixIconClick"
          >
            <rect style="fill: none"></rect>
            <path
              class="search_svg__st1"
              d="M7.22 1.67c3.04 0 5.5 2.46 5.5 5.5 0 1.33-.47 2.55-1.25 3.49l2.73 2.69c.19.19.19.51 0 .7s-.51.19-.7 0l-2.73-2.68c-.96.81-2.19 1.3-3.54 1.3-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.49-5.5zm0 1.01a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"
            ></path>
          </svg>
        </template>
      </tiny-search-box>
    </div>
  </div>
</template>

<script>
import { dataSource } from './data-source'

export default {
  data() {
    return {
      items: dataSource,
      tags1: [],
      tags2: [],
      tags3: []
    }
  },
  methods: {
    handleSuffixIconClick() {
      console.log('后缀图标被点击了')
    }
  }
}
</script>

<style scoped>
.demo-suffix-icon {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.custom-suffix-icon {
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}

.custom-suffix-icon:hover {
  color: var(--vp-c-brand);
}
</style>
