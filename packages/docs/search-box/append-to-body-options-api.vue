<template>
  <ClientOnly>
    <div class="demo-append-body">
      <tiny-search-box
        v-model="tags2"
        :items="items"
        editable
        :append-to-body="false"
      />
    </div>
  </ClientOnly>
</template>

<script>
import { dataSource } from './data-source'

export default {
  data() {
    return {
      items: dataSource,
      tags1: []
    }
  }
}
</script>

<style scoped>
.demo-append-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-title {
  margin-bottom: 8px;
  font-size: 14px;
}

.with-overflow {
  max-width: 480px;
  overflow: hidden;
}
</style>
