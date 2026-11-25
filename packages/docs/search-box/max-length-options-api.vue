<template>
  <div class="demo">
    <tiny-search-box
      v-model="tags"
      :items="dataSource"
      :maxlength="maxlength"
      editable
    />
  </div>
</template>

<script>
import TinySearchBox from '@opentiny/vue-search-box'

export default {
  components: {
    TinySearchBox,
  },
  data() {
    return {
      tags: [],
      maxlength: 8,
      dataSource: [
        {
          label: '名称',
          field: 'testName',
        },
      ],
    };
  },
};
</script>
