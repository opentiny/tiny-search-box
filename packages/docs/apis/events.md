# Events

| 名称               | 类型                                                                                                                         | 说明                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| change             | (newFilters: [ISearchBoxItem[]](types.md#isearchboxitem) , oldFilters: [ISearchBoxItem[]](types.md#isearchboxitem) ) => void | 绑定值变化触发的回调函数                              |
| exceed             | (n: number) => void                                                                                                          | 输入值超出限定长度 [props.maxlength] 的值时触发       |
| first-level-select | (n: string) => void                                                                                                          | 监听第一层级选择事件                                  |
| second-level-enter | (item: [ISearchBoxItem](types.md#isearchboxitem), options: [ISearchBoxOption[]](types.md#isearchboxoption)) => void          | 在一级面板选择属性后按回车时触发，返回当前选中的 item |
| help               | string                                                                                                                       | 点击帮助图标触发的回调函数                            |
| search             | (filters: [ISearchBoxItem[]](types.md#isearchboxitem) ) => void                                                              | 按下回车或点击搜索按钮触发搜索功能的回调函数          |
