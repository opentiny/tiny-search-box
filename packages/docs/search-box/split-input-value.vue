<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="items" :split-input-value="'|'" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { dataSource } from "./data-source";

const tags = ref([]);
const items = dataSource;
</script>
