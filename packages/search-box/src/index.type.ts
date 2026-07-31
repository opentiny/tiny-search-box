/**
 * tag类型, radio-默认单选， input-输入型， checkbox-多选，map-键值tag, numRange-数字范围tag,
 * dateRange-日期范围tag, datetimeRange-日期时间范围tag, custom-自定义面板tag。tag 的分类是根据键值的结果划分
 */
export type ISearchBoxTagType = 'radio' | 'input' | 'checkbox' | 'map' | 'numRange' | 'dateRange' | 'datetimeRange' | 'custom'
/**
 * 候选tag数据配置项
 */
export interface ISearchBoxItem {
  /**
   * 搜索字段，tag的键，'keyword' 作为组件内部保留字，请勿传入该值
   */
  field: string
  /**
   * tag 键的显示值，实际结果是field
   */
  label: string
  /**
   * 配置项可生产的tag类型
   */
  type?: ISearchBoxTagType
  /**
   * tag 值的选择项数据
   */
  options?: Array<ISearchBoxOption>
  /**
   * 自动识别匹配正则
   * 10.0.2 新增
   */
  regexp?: RegExp
  /**
   * radio 单选类型可设置, 设置为false时,单选属性可以多次选择
   */
  replace?: boolean
  /**
   * 单选或多选值的选中项键值
   * 10.0.2 新增
   */
  optionValueKey?: string
  /**
   * dateRange 类型日期显示和结果格式，dateRange时必选
   */
  format?: string
  /**
   * numRange 最小值，类型为number
   * dateRange开始日期，类型为Date
   */
  start?: number | Date
  /**
   * numRange 最大值，类型为number
   * dateRange起始日期，类型为Date
   */
  end?: number | Date
  /**
   * numRange 可填最小值，用于校验
   * dateRange可选最小值，用于校验
   */
  min?: number | Date
  /**
   * numRange 可填最大值，用于校验
   * dateRange可选最大值，用于校验
   */
  max?: number | Date
  /**
   * 每个item对应的提示文本
   */
  placeholder?: string
  /**
   * 搜索的字段范围
   */
  searchKeys?: Array<string>
  /**
   * 标识字段映射，3.13.0新增
   */
  idMapKey?: string
  /**
   * 标签分隔符数组[3.14.0新增]
   */
  operators?: Array<string>
  /**
   * type=checkbox时，设置是否合并成一个标签[3.16.0新增]
   */
  mergeTag?: boolean
  /**
   * 编辑状态此属性禁用状态，常用以设置不可变更
   */
  editAttrDisabled?: boolean
  /**
   * type=dateRange/datetimeRange时生效，设置用户只能选择某个时间跨度，只接受毫秒数
   */
  maxTimeLength?: number
  /**
   * type=dateRange/datetimeRange时生效，透传给内部 tiny-date-picker 的 picker-options 配置
   * 支持 firstDayOfWeek / disabledDate / shortcuts 等属性，
   * 其中 disabledDate 会与组件内部基于 maxTimeLength / min / max 的禁用逻辑合并（任一返回 true 即禁用）
   * 注：search-box 内部使用两个独立的单日期选择器（开始/结束），并非一个 daterange 范围选择器，
   * 故仅针对 daterange 范围选择器生效的 onPick 回调在此不适用，配置后不会触发
   */
  pickerOptions?: {
    firstDayOfWeek?: number
    disabledDate?: (time: Date) => boolean
    shortcuts?: Array<{
      text: string
      onClick?: (picker: { $emit: (type: string, date: Date | Date[]) => void }) => void
      type?: 'startFrom' | 'endAt'
      startDate?: Date
      endDate?: Date
    }>
    [propName: string]: any
  }
  /**
   * type=custom时生效，用于指定二级面板的插槽名，对应的编辑态自定义面板插槽名为item.slotName + '-edit'
   */
  slotName?: string
  /**
   * 自定义分组名，默认为：'0'
   */
  groupKey?: string
  /**
   * 是否异步加载 options，设置为 true 时 options 为空数组会显示 loading 等待数据填充；
   * 不设置或为 false 时 options 为空数组不显示 loading
   */
  asyncLoading?: boolean
  /**
   * 该选项生成的标签是否禁止删除；禁止删除后仍可编辑，但仅允许修改值，
   * 不允许切换属性/类型（否则等同于变相删除）
   */
  disableDelete?: boolean
  [propName: string]: any
}

export interface ISearchBoxOption {
  /**
   * 选项显示值
   */
  label: string
  /**
   * 搜索目标字段，只有‘label’才需要
   */
  field?: string
  /**
   * 控制map类型二级选项是否出现内置所有值，map类型需要
   */
  allValues?: boolean
  /**
   * 控制map类型二级选项是否出现内置空值，map类型需要
   */
  emptyValue?: boolean
  /**
   * map类型二级选项数据
   */
  options?: Array<any>
  [propName: string]: any
}
/**
 * 每个选中tag的类型
 */
export interface ISearchBoxTag {
  /**
   * 搜索目标搜字段
   */
  field: string
  /**
   * tag键，field的显示值
   */
  label: string
  /**
   * tag值
   */
  value: string
  /**
   * 类型
   */
  type: ISearchBoxTagType
  /**
   * 数字范围和日期范围tag 开始值
   */
  start?: number | string
  /**
   * 数字范围和日期范围tag 结束值
   */
  end?: number | string
  [propName: string]: any
}

/**
 * 潜在匹配项的函数返回值类型
 */
interface ISearchBoxMatchItem {
  label: string
  field: string
  value: string
  type?: string
}

export interface ISearchBoxMatchOptions {
  getMatchList: (arg1: string) => ISearchBoxMatchItem[] | Promise<ISearchBoxMatchItem[]> // 潜在匹配对象返回的方法，支持同步或异步
}

export interface ISearchBoxNewTag {
  /**
   * type 新标签所属第一层元素的type类型值
   */
  type: string
  /**
   * field 新标签所属第一层元素的field值
   */
  field: string
  /**
   * label 新标签label值，即标签左侧值
   */
  label: string
  /**
   * value 新标签的value值，即标签右侧值
   */
  value: string
  /**
   * start 日期标签或大小标签的起始值，可选参数
   */
  start?: string | number
  /**
   * end 日期标签或大小标签的结束值，可选参数
   */
  end?: string | number
  /**
   * id 新标签的idMapKey对应的属性值，可用来识别标签，可以是id也可以是idMapKey指定的值，可选参数
   */
  id?: string | number
  /**
   * operator标签分隔符，可选参数
   */
  operator?: string
  /**
   * checkbox类型下使用mergeTag为true时，合并的标签信息，
   */
  options?: ISearchBoxTag[]
}

// SearchBox 尺寸
export type ISearchBoxSize = '' | 'small'