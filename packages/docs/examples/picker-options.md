## 日期选择器配置

通过给 `dateRange` / `datetimeRange` 类型的 item 配置 `pickerOptions`，可以透传给内部 `tiny-date-picker` 的 `picker-options`，支持快捷选项（shortcuts）、自定义周首日（firstDayOfWeek）、选中回调（onPick）以及禁用日期（disabledDate）。

其中 `disabledDate` 会与组件内部基于 `maxTimeLength` / `min` / `max` 的禁用逻辑合并：任一返回 `true` 即禁用该日期，方便在保留内置校验的同时叠加自定义限制。

<preview path="../search-box/picker-options.vue"></preview>
