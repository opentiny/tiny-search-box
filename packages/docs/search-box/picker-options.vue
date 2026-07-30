<template>
  <ClientOnly>
    <tiny-search-box v-model="tags" :items="items" @change="onChange" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const tags = ref([]);

const items = reactive([
  {
    label: "日期",
    field: "date",
    type: "dateRange",
    format: "yyyy/MM/dd",
    // 通过 pickerOptions 透传给内部 tiny-date-picker，这里演示快捷选项与自定义周首日
    pickerOptions: {
      firstDayOfWeek: 1,
      shortcuts: [
        {
          text: "最近一周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          },
        },
        {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          },
        },
        {
          text: "最近三个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
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
    label: "时间日期",
    field: "datetime",
    type: "datetimeRange",
    format: "yyyy/MM/dd HH:mm:ss",
    pickerOptions: {
      firstDayOfWeek: 7,
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            const date = new Date();
            picker.$emit("pick", [date, date]);
          },
        },
        {
          text: "昨天",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit("pick", [date, date]);
          },
        },
      ],
    },
  },
]);

const onChange = (newFilters, oldFilters) => {
  console.log("changeEvent:", newFilters, oldFilters);
};
</script>
