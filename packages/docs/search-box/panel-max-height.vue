<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="items" panel-max-height="100px" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { dataSource } from "./data-source";

const items = dataSource;
const tags = ref([]);
</script>
