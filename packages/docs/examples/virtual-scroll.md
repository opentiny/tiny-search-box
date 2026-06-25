## 虚拟滚动

当数据选项数量较多时（如上千条），二级面板内置虚拟滚动机制，只渲染视口内可见的选项节点，保证滚动流畅不卡顿。

虚拟滚动对 `radio`（单选）、`checkbox`（多选）、`map`（标签）三种类型的二级面板均生效，无需额外配置。配合 `panel-max-height` 可控制下拉面板的滚动区域高度。

<preview path="../search-box/virtual-scroll.vue"></preview>

### 工作原理

- 固定行高（32px），通过滚动监听计算当前可视区域
- 只渲染视口内 + 上下各 5 行缓冲项，DOM 节点数恒定（约 20~30 个）
- 使用占位元素撑开总高度，内容容器通过 `translateY` 定位到正确位置
- 搜索输入变化时自动重置滚动位置到顶部

### Data Source

<<< ../search-box/virtual-scroll-data.ts
