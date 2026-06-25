<template>
  <div class="demo">
    <tiny-search-box
      v-model="tags"
      :items="items"
      panel-max-height="300px"
    />
  </div>
</template>

<script>
import TinySearchBox from '@opentiny/vue-search-box'
import { virtualScrollDataSource } from './virtual-scroll-data'

export default {
  components: {
    TinySearchBox
  },
  data() {
    return {
      items: virtualScrollDataSource,
      tags: []
    }
  }
}
</script>
