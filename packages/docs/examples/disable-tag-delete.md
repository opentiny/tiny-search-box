## 禁止删除标签

在 `items` 数据项配置中设置 `disableDelete: true`，可使该选项生成的标签禁止删除。被禁止删除的标签不展示关闭按钮，也无法通过清空按钮或退格键删除；编辑时仅允许修改值，不允许切换属性/类型（否则等同于变相删除）。

<preview path="../search-box/disable-tag-delete.vue"></preview>

