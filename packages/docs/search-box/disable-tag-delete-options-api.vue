<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="items" editable />
    <div class="disable-tag-delete-tip">
      「名称」配置了 disableDelete，标签不可删除；编辑时仅可修改值，不可切换属性。
    </div>
  </ClientOnly>
</template>

<script>
import TinySearchBox from '@opentiny/vue-search-box'

export default {
  components: {
    TinySearchBox
  },
  data() {
    return {
      items: [
        {
          label: '名称',
          field: 'testName',
          replace: true,
          // 该选项生成的标签禁止删除，但仍可编辑修改
          disableDelete: true,
          options: [
            { label: 'ecs-1' },
            { label: 'obs-2' },
            { label: 'vpc-1' }
          ]
        },
        {
          label: '可用地区',
          field: 'testRegion',
          type: 'checkbox',
          options: [
            { label: '华南区', id: '2-1' },
            { label: '华北区', id: '2-2' },
            { label: '西北区', id: '2-3' }
          ]
        },
        {
          label: '个人IP地址',
          field: 'ip',
          replace: true,
          options: [
            { label: '192.168.0.1' },
            { label: '192.168.0.2' }
          ]
        }
      ],
      tags: [
        {
          field: 'testName',
          label: '名称',
          value: 'ecs-1',
          type: 'radio'
        },
        {
          field: 'ip',
          label: '个人IP地址',
          value: '192.168.0.1'
        }
      ]
    }
  }
}
</script>

<style scoped>
.disable-tag-delete-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #6b7280;
}
</style>
