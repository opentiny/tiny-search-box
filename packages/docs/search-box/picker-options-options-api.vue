<template>
  <div class="demo">
    <tiny-search-box v-model="tags" :items="items" @change="onChange" />
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
      items: [
        {
          label: '日期',
          field: 'date',
          type: 'dateRange',
          format: 'yyyy/MM/dd',
          // 通过 pickerOptions 透传给内部 tiny-date-picker，这里演示快捷选项与自定义周首日
          // 注意：search-box 内部使用两个独立的单日期选择器（开始/结束），并非一个 daterange 范围选择器，
          // 因此 shortcuts 的 onClick 需 emit 单个日期（emit 数组无法回填），快捷项会填入当前打开的那个选择器
          pickerOptions: {
            firstDayOfWeek: 1,
            shortcuts: [
              {
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                },
              },
              {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                },
              },
              {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                },
              },
              {
                text: '一个月前',
                onClick(picker) {
                  const date = new Date();
                  date.setMonth(date.getMonth() - 1);
                  picker.$emit('pick', date);
                },
              },
            ],
            // 自定义 disabledDate，会与组件内部禁用逻辑合并（任一返回 true 即禁用）
            disabledDate(time) {
              // 禁用今天之后的所有日期
              return time.getTime() > Date.now();
            },
          },
        },
        {
          label: '时间日期',
          field: 'datetime',
          type: 'datetimeRange',
          format: 'yyyy/MM/dd HH:mm:ss',
          pickerOptions: {
            firstDayOfWeek: 7,
            shortcuts: [
              {
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                },
              },
              {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                },
              },
            ],
          },
        },
      ],
    };
  },
  methods: {
    onChange(newFilters, oldFilters) {
      console.log('changeEvent:', newFilters, oldFilters);
    },
  },
};
</script>
