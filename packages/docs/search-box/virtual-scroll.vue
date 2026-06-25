<template>
  <ClientOnly>
    <tiny-search-box
      v-model="tags"
      :items="items"
      panel-max-height="300px"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { virtualScrollDataSource } from "./virtual-scroll-data";

const items = virtualScrollDataSource;
const tags = ref([]);
</script>
