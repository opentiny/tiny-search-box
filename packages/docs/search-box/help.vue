<script setup lang="ts">
import { ref } from "vue";
import { dataSource } from "./data-source";
const tags = ref([]);
const handleHelp = () => {
  console.log("Help Event");
};
</script>

<template>
  <ClientOnly>
    <tiny-search-box
      v-model="tags"
      :show-help="true"
      :items="dataSource"
      @help="handleHelp"
    />
  </ClientOnly>
</template>
