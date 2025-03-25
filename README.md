# TinySearchBox comprehensive search

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

TinySearchBox is a powerful and easy-to-use comprehensive search component developed based on tiny Vue. Support multiple criteria filtering such as single choice, multiple choice, time, and time interval.

[English](README.md) | 简体中文

## Project advantages

TinySearchBox has the following characteristics and advantages:

-Contains multiple types of conditional filtering, ready to use out of the box.
-Powerful search function, supporting fuzzy search, single choice, multiple choice, time, time interval, number size, number interval, as well as custom search, etc.

## quick start

install TinySearchBox

```shell
npm i @opentiny/vue-search-box
```

html：

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

import styles:

```css
@import '@opentiny/vue-search-box/index.css';
```

Initialize TinySearchBox:

```javascript
import TinySearchBox from '@opentiny/vue-search-box';
```

## Local development

```shell
git clone git@github.com:opentiny/tiny-search-box.git
cd tiny-search-box
pnpm i
pnpm dev
```

Open a browser to access：[http://localhost:5173/](http://localhost:5173/)

## License

[MIT](LICENSE)
