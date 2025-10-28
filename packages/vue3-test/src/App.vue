<script setup>
import { ref } from "vue";
import { dataSource } from "./data-source";

const tags = ref([]);
</script>

<template>
  <div>
    <TinySearchBox v-model="tags" :items="dataSource"></TinySearchBox>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
