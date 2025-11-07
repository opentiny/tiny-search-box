<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :default-field="defaultField" :items="dataSource" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { dataSource } from "./data-source";

const tags = ref([]);
const defaultField = ref("testRegion");
</script>
