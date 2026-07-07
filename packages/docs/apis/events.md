# Events

| 名称               | 类型                                                                                                                         | 说明                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| change             | (newFilters: [ISearchBoxTag[]](types.md#isearchboxtag) , oldFilters: [ISearchBoxTag[]](types.md#isearchboxtag) ) => void | 绑定值变化触发的回调函数                              |
| exceed             | (n: number) => void                                                                                                          | 输入值超出限定长度 [props.maxlength] 的值时触发       |
| first-level-select | (n: string) => void                                                                                                          | 监听第一层级选择事件                                  |
| second-level-enter | (item: [ISearchBoxItem](types.md#isearchboxitem)) => void                                                                    | 在一级面板选择属性后按回车时触发，返回当前选中的 item |
| help               | () => void                                                                                                                   | 点击帮助图标触发的回调函数                            |
| search             | (filters: [ISearchBoxTag[]](types.md#isearchboxtag) ) => void                                                                | 按下回车或点击搜索按钮触发搜索功能的回调函数          |
| clear              | () => void                                                                                                                   | 点击清空按钮时触发                                    |
| tag-click          | (tag: [ISearchBoxTag](types.md#isearchboxtag)) => void                                                                       | 点击标签时触发，返回被点击的标签对象                  |
| validate-error     | (error: { invalidValues: string[], field: string, label: string, regexp?: RegExp }) => void                                 | 输入值校验失败时触发                                  |
