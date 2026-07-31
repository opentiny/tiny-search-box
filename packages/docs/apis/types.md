# Types

## ISearchBoxItem

```typescript
interface ISearchBoxItem {
  field: string; // 搜索字段，tag的键，'keyword' 作为组件内部保留字，请勿传入该值
  label: string; // tag 键的显示值，实际结果是field
  type?: ISearchBoxTagType; // 配置项可生产的tag类型
  options?: ISearchBoxOption[]; // tag 值的选择项数据
  regexp?: RegExp; // 自动识别匹配正则
  replace?: boolean; // radio 单选类型可设置，设置为false时单选属性可以多次选择
  optionValueKey?: string; // 单选或多选值的选中项键值
  format?: string; // dateRange 类型日期显示和结果格式，dateRange时必选
  start?: number | Date; // numRange 最小值，类型为number；dateRange开始日期，类型为Date
  end?: number | Date; // numRange 最大值，类型为number；dateRange起始日期，类型为Date
  min?: number | Date; // numRange 可填最小值，用于校验；dateRange可选最小值，用于校验
  max?: number | Date; // numRange 可填最大值，用于校验；dateRange可选最大值，用于校验
  placeholder?: string; // 每个item对应的提示文本
  searchKeys?: Array<string>; // 搜索的字段范围
  idMapKey?: string; // 标识字段映射
  operators?: Array<string>; // 标签分隔符数组
  mergeTag?: boolean; // type=checkbox时生效，设置是否合并成一个标签
  editAttrDisabled?: boolean; // 编辑状态此属性禁用状态，常用以设置不可变更
  maxTimeLength?: number; // type=dateRange/datetimeRange时生效，设置用户只能选择某个时间跨度，只接受毫秒数
  pickerOptions?: IPickerOptions; // type=dateRange/datetimeRange时生效，透传给内部 tiny-date-picker 的 picker-options 配置，支持 firstDayOfWeek / disabledDate / shortcuts，其中 disabledDate 会与组件内部禁用逻辑合并
  slotName?: string; // type=custom时生效，用于指定二级面板的插槽名，对应的编辑态自定义面板插槽名为item.slotName + '-edit'
  groupKey?: string; // 自定义分组名，默认为：'0'
  asyncLoading?: boolean; // 是否异步加载 options，为 true 时空数组会显示 loading 等待数据；不设置或为 false 时空数组不显示 loading
  disableDelete?: boolean; // 该选项生成的标签是否禁止删除；禁止删除后仍可编辑，但仅允许修改值，不允许切换属性/类型（否则等同于变相删除）
  [propName: string]: any;
}

type ISearchBoxTagType =
  | 'radio'
  | 'input'
  | 'checkbox'
  | 'map'
  | 'numRange'
  | 'dateRange'
  | 'datetimeRange'
  | 'custom'
```

## ISearchBoxOption

```typescript
interface ISearchBoxOption {
  label: string; // 选项显示值
  field?: string; // 搜索目标字段，只有'label'才需要
  allValues?: boolean; // 控制map类型二级选项是否出现内置所有值，map类型需要
  emptyValue?: boolean; // 控制map类型二级选项是否出现内置空值，map类型需要
  options?: Array<any>; // map类型二级选项数据
  [propName: string]: any;
}
```

## ISearchBoxTag

```typescript
interface ISearchBoxTag {
  field: string; // 搜索目标搜字段
  label: string; // tag键，field的显示值
  value: string; // tag值
  type: ISearchBoxTagType; // 类型
  start?: number | string; // 数字范围和日期范围tag 开始值
  end?: number | string; // 数字范围和日期范围tag 结束值
  operator?: string; // 分隔符[3.14.0新增]
  [propName: string]: any;
}
```

## ISearchBoxMatchItem

```typescript
interface ISearchBoxMatchItem {
  label: string;
  field: string;
  value: string;
  type?: string;
}
```

## ISearchBoxMatchOptions

```typescript
interface ISearchBoxMatchOptions {
  getMatchList: (arg1: string) => ISearchBoxMatchItem[] | Promise<ISearchBoxMatchItem[]>; // 潜在匹配对象返回的方法，支持同步或异步
}
```

## ISearchBoxNewTag

```typescript
interface ISearchBoxNewTag {
  type: string; // 新标签所属第一层元素的type类型值
  field: string; // 新标签所属第一层元素的field值
  label: string; // 新标签label值，即标签左侧值
  value: string; // 新标签的value值，即标签右侧值
  start?: string | number; // 日期标签或大小标签的起始值，可选参数
  end?: string | number; // 日期标签或大小标签的结束值，可选参数
  id?: string | number; // 新标签的idMapKey对应的属性值，可用来识别标签，可选参数
  operator?: string; // 标签分隔符，可选参数
  options?: ISearchBoxTag[]; // checkbox类型下使用mergeTag为true时，合并的标签信息
}
```

## ISearchBoxSize

```typescript
type ISearchBoxSize = '' | 'small'
```

## IPickerOptions

```typescript
interface IPickerOptions {
  firstDayOfWeek?: number; // 每周的第一天是星期几，默认值是7，也就是星期天
  disabledDate?: (time: Date) => boolean; // 实现部分禁用，返回 true 表示禁用该日期；会与组件内部基于 maxTimeLength / min / max 的禁用逻辑合并（任一返回 true 即禁用）
  shortcuts?: Array<{
    text: string; // 快捷项的显示文本
    onClick?: (picker: { $emit: (type: string, date: Date | Date[]) => void }) => void; // 点击快捷项的回调，使用 type: 'startFrom'/'endAt' 时无需传入
    type?: 'startFrom' | 'endAt'; // 'startFrom' 指定某日起始；'endAt' 指定某日为止
    startDate?: Date; // 配合 type: 'endAt' 设置起始边界
    endDate?: Date; // 配合 type: 'startFrom' 设置结束边界
  }>;
  [propName: string]: any;
}
```

::: tip 说明
`search-box` 内部使用两个独立的单日期选择器（开始/结束），并非一个 `daterange` 范围选择器。因此仅针对范围选择器生效的 `onPick` 回调在此不适用（配置后不会触发）；`shortcuts` 的 `onClick` 中应 `emit` 单个日期（`emit` 数组无法回填），快捷项会填入当前打开的那个选择器。
:::
