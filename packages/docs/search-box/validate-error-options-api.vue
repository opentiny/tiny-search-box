<template>
  <div class="demo">
    <tiny-search-box
      v-model="tags"
      :items="items"
      split-input-value=","
      @validate-error="handleValidateError"
    />
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import TinySearchBox from "@opentiny/vue-search-box";

export default {
  components: {
    TinySearchBox,
  },
  data() {
    return {
      tags: [],
      errorMessage: "",
      // 配置数据项，包含 regexp 校验条件
      items: [
        {
          label: "邮箱",
          field: "email",
          // 使用正则表达式校验邮箱格式
          regexp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          placeholder: "请输入邮箱地址，多个邮箱用逗号分隔",
        },
        {
          label: "手机号",
          field: "phone",
          // 使用正则表达式校验手机号格式（11位数字）
          regexp: /^1[3-9]\d{9}$/,
          placeholder: "请输入手机号，多个手机号用逗号分隔",
        },
        {
          label: "IP地址",
          field: "ip",
          // 使用正则表达式校验IP地址格式
          regexp: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
          placeholder: "请输入IP地址，多个IP用逗号分隔",
        },
        {
          label: "普通文本",
          field: "text",
          // 没有 regexp，不进行校验
          placeholder: "普通文本，无需校验",
        },
      ],
    };
  },
  methods: {
    // 处理校验错误事件
    handleValidateError(error) {
      const { invalidValues, field, label, regexp } = error;

      // 构建错误提示信息
      const message = `字段 "${label}" (${field}) 的以下值不符合校验规则 ${regexp}：\n${invalidValues.join(", ")}`;

      this.errorMessage = message;
    },
  },
};
</script>

<style scoped>
.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #cf1322;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
}
</style>

