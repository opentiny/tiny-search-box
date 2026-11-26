<template>
  <ClientOnly>
    <tiny-search-box
      v-model="tags"
      :items="dataSource"
      :maxlength="maxlength"
      editable
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tags = ref([]);
const maxlength = ref(8);
const dataSource = [
  {
    label: "名称",
    field: "testName",
  },
];
</script>
