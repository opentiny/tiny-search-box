<template>
  <tiny-search-box v-model="tags" :items="items" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const tags = ref([]);

const items = ref([
  {
    label: '备注',
    field: 'remark',
    type: 'input',
    options: [
      { label: ' urgent' },
      { label: 'normal' },
      { label: 'low' }
    ]
  },
  {
    label: '描述',
    field: 'description',
    type: 'input'
  },
  {
    label: '单选字段',
    field: 'radioField',
    type: 'radio',
    options: [
      { label: '选项A' },
      { label: '选项B' }
    ]
  }
]);
</script>
