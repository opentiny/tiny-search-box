<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: '实例ID',
    regexp: /^\w+-\w+-\w+-\w+-\w$/,
    field: 'instancesId',
    options: [
      {
        label: 'yun-ID',
        allValues: false
      },
      {
        label: 'tuandui-ID'
      },
      {
        label: 'tiny-vue-plus-search-box-ID'
      }
    ]
  }
])

const tags = ref([])

const FirstLevelSelect = (field) => {
  console.log('FirstLevelSelect', field)
}
</script>

<template>
  <tiny-search-box v-model="tags" :items="items" split-input-value="|" @first-level-select="FirstLevelSelect" />
</template>
