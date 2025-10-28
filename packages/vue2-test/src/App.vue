<script>
import { dataSource } from "./data-source.js";
import { iconSearch } from "@opentiny/vue-icon";
import TinySearchBox from "../../search-box/src/index.ts";
// console.info(TinySearchBox)
// const

// const tags = ref([
// ])
// const IconSearch = iconSearch()

export default {
  components: {
    IconSearch: iconSearch(),
    TinySearchBox,
  },
  data() {
    return {
      tags: [],
      dataSources: [...dataSource],
      a: false,
    };
  },
};
</script>

<template>
  <div class="wrapper">
    <IconSearch />
    <tiny-search-box v-model="tags" :items="dataSources"> </tiny-search-box>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100vw;
}
</style>
