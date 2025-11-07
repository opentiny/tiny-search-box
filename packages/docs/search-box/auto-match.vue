<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="items" default-field="keyword" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { dataSource } from "./data-source";

const items = dataSource;
const tags = ref([]);
</script>
