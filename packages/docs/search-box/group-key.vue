<script setup lang="ts">
import { reactive, ref } from "vue";
import { data } from "./group-key-data";

const tags = ref([]);
const items = reactive(data);
</script>

<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="items" />
  </ClientOnly>
</template>
