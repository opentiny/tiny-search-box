<script setup lang="ts">
import { ref } from 'vue'

import { dataSource } from './data-source'

const items = dataSource

const tags = ref([])

const onSearch = (filters) => {
  console.log('searchEvent:', filters)
}

const onChange = (newFilters, oldFilters) => {
  console.log('changeEvent:', newFilters, oldFilters)
}
</script>

<template>
  <tiny-search-box v-model="tags" :items="items" :show-no-data-tip="false" @search="onSearch" @change="onChange" />
</template>
