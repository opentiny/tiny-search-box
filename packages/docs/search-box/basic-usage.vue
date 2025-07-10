<script setup lang="ts">
import { ref } from 'vue'
import { dataSource } from './data-source'

const tags = ref([])
</script>

<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="dataSource" />
  </ClientOnly>
</template>
