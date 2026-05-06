<template>
  <tiny-search-box v-model="tags" :default-field-replace="true" :items="dataSource" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { dataSource } from "./data-source";

const tags = ref([]);
</script>
