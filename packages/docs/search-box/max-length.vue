<script setup lang="ts">
import { ref } from 'vue'

const tags = ref([])
const maxlength = ref(8)
const dataSource = [
  {
    label: '名称',
    field: 'testName',
    replace: true,
    options: [
      {
        label: `不能超过${maxlength.value}个字符`
      }
    ]
  }
]

const handleExceed = (number) => {
  alert(`不能超过${number}个字符`)
}
</script>

<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="dataSource" :maxlength="maxlength" @exceed="handleExceed" />
  </ClientOnly>
</template>
