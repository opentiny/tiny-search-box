# TinySearchBox 综合搜索

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

TinySearchBox 是一个基于 tiny-vue 开发的强大而简单易用的综合搜索组件。支持单选、多选，时间，时间区间等多条件筛选。

[English](README.md) | 简体中文

## 项目优势

TinySearchBox 主要有以下特点和优势：

- 包含多种类型条件筛选，开箱即用。
- 强大的搜索功能，支持模糊搜索，单选、多选，时间，时间区间，数字大小，数字区间，以及自定义搜索等。

## 快速入门

安装 TinySearchBox

```shell
npm i @opentiny/vue-search-box
```

编写 html：

```html
<script setup>
  const tags = ref([]);
  const items = ref([
    {
      label: '名称',
      field: 'testName',
      replace: true,
      placeholder: '我是自定义名称的占位符',
      options: [
        {
          label: 'test-1'
        },
        {
          label: 'test-2'
        }
      ]
    },
    {
      label: '可用地区',
      field: 'testRegion',
      type: 'checkbox',
      mergeTag: true,
      placeholder: '我是自定义可选地区的占位符',
      editAttrDisabled: true, // 编辑状态此属性禁用，不可变更
      options: [
        {
          label: '华南区',
          id: '2-1'
        },
        {
          label: '华北区',
          id: '2-2'
        }
      ]
    },
    {
      label: '大小',
      field: 'size',
      type: 'numRange',
      placeholder: '我是自定义大小的占位符',
      unit: 'GB',
      start: -1,
      min: -1,
      max: 20
    }
  ]);
</script>

<template>
  <TinySearchBox v-model="tags" :items="items"></TinySearchBox>
</template>
```

引入样式：

```css
@import '@opentiny/vue-search-box/index.css';
```

初始化 TinySearchBox 综合搜索：

```javascript
import TinySearchBox from '@opentiny/vue-search-box';
```

## 本地开发

```shell
git clone git@github.com:opentiny/tiny-search-box.git
cd tiny-search-box
pnpm i
pnpm dev
```

打开浏览器访问：[http://localhost:5173/tiny-search-box/](http://localhost:5173/tiny-editor/)

## License

[MIT](LICENSE)
