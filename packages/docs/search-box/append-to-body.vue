<template>
  <ClientOnly>
    <div class="demo-append-body">
      <tiny-search-box
        v-model="tags2"
        :items="items"
        editable
        panel-max-height="160px"
        :append-to-body="false"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dataSource } from './data-source'

const items = dataSource
const tags1 = ref([])
const tags2 = ref([])
</script>

<style scoped>
.demo-append-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-box {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.demo-title {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.with-overflow {
  max-width: 480px;
  overflow: hidden;
}
</style>
