export default {
  mode: ['pc'],
  apis: [
    {
      name: 'SearchBox',
      type: 'component',
      props: [
        {
          name: 'default-field',
          type: 'string',
          defaultValue: '',
          desc: {
            'zh-CN':
              '自定义按下enter键时，默认搜索的范围；此属性为空时，则默认在关键字范围下搜索 xxx，即生成的搜索标签为 `关键字：xxx` 【3.13.0版本新增】',
            'en-US':
              'Customize the default search range when you press Enter. If this parameter is left blank, xxx is searched in the keyword range by default. That is, the generated search tag is `Keyword: xxx`，[Added in 3.13.0]'
          },
          demoId: 'settings'
        },
        {
          name: 'editable',
          type: 'boolean',
          defaultValue: 'false',
          desc: {
            'zh-CN': '是否开启标签编辑功能，（注：map 类型不支持编辑）【3.14.0新增】',
            'en-US':
              'Whether to enable the tag editing function. (Note: The map type does not support editing.)[Added in 3.14.0]'
          },
          demoId: 'editable'
        },
        {
          name: 'empty-placeholder',
          type: 'string',
          defaultValue: `''`,
          desc: {
            'zh-CN': '没有筛选项时的占位文本',
            'en-US': 'Placeholder text with no filtered items'
          },
          demoId: 'empty-placeholder'
        },
        {
          name: 'id-map-key',
          type: 'string',
          defaultValue: `'id'`,
          desc: {
            'zh-CN':
              '配置用来识别筛选项的 id 键取值来源，默认取自 props.items 数据的 id 键，一般用于接口返回的 props.items 数据字段不匹配，但是又需要其中一个键值来识别筛选项的情况；注意：不建议使用 label/value/field 等字段，会被覆盖',
            'en-US':
              'Source of the ID key used to identify a filtering item. The default value is the ID key of the props.items data. Generally, this parameter is used when the props.items data field returned by the interface does not match but one of the key values is required to identify a filtering item.Note: You are not advised to use the label, value, and field fields because they will be overwritten'
          },
          demoId: 'id-map-key'
        },
        {
          name: 'items',
          type: 'ISearchBoxItem[]',
          typeAnchorName: 'ISearchBoxItem',
          defaultValue: '[]',
          desc: {
            'zh-CN': '数据项',
            'en-US': 'Data items'
          },
          demoId: 'basic-usage'
        },
        {
          name: 'maxlength',
          type: 'number',
          defaultValue: '',
          desc: {
            'zh-CN': 'input 元素的原生属性，限制输入框的长度，可配合 exceed 监听输入超出限定长度的事件【3.16.0新增】',
            'en-US':
              'Native attribute of the input element, which limits the length of the input box. This attribute can be used with exceed to listen to the event that the input exceeds the specified length[Added in 3.16.0]'
          },
          demoId: 'max-length'
        },
        {
          name: 'model-value/v-model',
          type: 'ISearchBoxTag[]',
          typeAnchorName: 'ISearchBoxTag',
          defaultValue: '[]',
          desc: {
            'zh-CN': '选中的标签列表',
            'en-US': 'List of selected tags'
          },
          demoId: 'v-model'
        },
        {
          name: 'panel-max-height',
          type: 'string',
          defaultValue: `'999px'`,
          desc: {
            'zh-CN': '设置下拉面板最大高度',
            'en-US': 'Set the maximum height of the drop-down panel.'
          },
          meta: {
            stable: '3.18.0'
          },
          demoId: 'panel-max-height'
        },
        {
          name: 'potential-options',
          type: '{ getMatchList: (arg1: string) => ISearchBoxMatchItem[] }',
          typeAnchorName: 'ISearchBoxMatchItem',
          defaultValue: 'null',
          desc: {
            'zh-CN': '潜在项匹配，接口返回潜在匹配项的数据列表，异步或同步皆可',
            'en-US':
              'Potential item matching. The interface returns the data list of potential matching items, which can be asynchronous or synchronous'
          },
          demoId: 'potential-options'
        },
        {
          name: 'show-help',
          type: 'Boolean',
          defaultValue: 'true',
          desc: {
            'zh-CN': '是否显示帮助图标',
            'en-US': 'Whether to display the help icon'
          },
          demoId: 'help'
        },
        {
          name: 'split-input-value',
          type: 'string',
          defaultValue: `','`,
          desc: {
            'zh-CN': '用于指定字符串，将输入值拆分成多个关键字，一次性生成多个标签，默认用英文逗号 "," 分隔',
            'en-US':
              'Specifies a character string. The input value is split into multiple keywords. Multiple tags are generated at a time. By default, the keywords are separated by commas (,).'
          },
          meta: {
            stable: '3.18.0'
          },
          demoId: 'split-input-value'
        }
      ],
      events: [
        {
          name: 'change',
          type: '(newFilters: ISearchBoxTag[], oldFilters: ISearchBoxTag[]) => void',
          typeAnchorName: 'ISearchBoxTag',
          defaultValue: '',
          desc: {
            'zh-CN': '绑定值变化触发的回调函数',
            'en-US': 'Callback function triggered by the change of the binding value'
          },
          demoId: 'auto-match'
        },
        {
          name: 'clear',
          type: '() => void',
          defaultValue: '',
          desc: {
            'zh-CN': '点击清空按钮时触发',
            'en-US': 'Triggered when the clear button is clicked'
          },
          demoId: 'auto-match'
        },
        {
          name: 'exceed',
          type: '(n: number) => void',
          defaultValue: '',
          desc: {
            'zh-CN': '输入值超出限定长度 [props.maxlength] 的值时触发',
            'en-US': 'Triggered when the input value exceeds the value of [props.maxlength]'
          },
          meta: {
            stable: '3.16.0'
          },
          demoId: 'max-length'
        },
        {
          name: 'first-level-select',
          type: '(n: string) => void',
          defaultValue: '',
          desc: {
            'zh-CN': '监听第一层级选择事件',
            'en-US': 'Listen to the first-level selection event'
          },
          meta: {
            stable: '3.18.0'
          },
          demoId: 'first-level-select'
        },
        {
          name: 'help',
          type: '() => void',
          defaultValue: '',
          desc: {
            'zh-CN': '点击帮助图标触发的回调函数',
            'en-US': 'Callback function triggered by clicking the help icon'
          },
          demoId: 'help'
        },
        {
          name: 'search',
          type: '(filters: ISearchBoxTag[]) => void',
          typeAnchorName: 'ISearchBoxTag',
          defaultValue: '',
          desc: {
            'zh-CN': '按下回车或点击搜索按钮触发搜索功能的回调函数',
            'en-US':
              'Callback function of the search function triggered by pressing Enter or clicking the search button'
          },
          demoId: 'auto-match'
        },
        {
          name: 'second-level-enter',
          type: '(item: ISearchBoxItem) => void',
          typeAnchorName: 'ISearchBoxItem',
          defaultValue: '',
          desc: {
            'zh-CN': '在一级面板选择属性后按回车时触发，返回当前选中的 item',
            'en-US': 'Triggered when pressing Enter after selecting an attribute in the first-level panel, returns the selected item'
          },
          demoId: 'auto-match'
        },
        {
          name: 'tag-click',
          type: '(tag: ISearchBoxTag) => void',
          typeAnchorName: 'ISearchBoxTag',
          defaultValue: '',
          desc: {
            'zh-CN': '点击标签时触发，返回被点击的标签对象',
            'en-US': 'Triggered when a tag is clicked, returns the clicked tag object'
          },
          demoId: 'editable'
        },
        {
          name: 'validate-error',
          type: '(error: { invalidValues: string[], field: string, label: string, regexp?: RegExp }) => void',
          defaultValue: '',
          desc: {
            'zh-CN': '输入值校验失败时触发',
            'en-US': 'Triggered when the input value fails validation'
          },
          demoId: 'validate-error'
        }
      ]
    }
  ],
  types: [
    {
      name: 'ISearchBoxItem',
      type: 'interface',
      code: `
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
  placeholder?: string; // 每个item对应的提示文本[3.18.0新增]
  editAttrDisabled?: boolean; // 编辑状态此属性禁用状态，常用以设置不可变更[3.19.0新增]
  searchKeys?: Array<string>; // 搜索的字段范围
  idMapKey?: string; // 标识字段映射[3.13.0新增]
  operators?: Array<string>; // 标签分隔符数组[3.14.0新增]
  mergeTag?: boolean; // type=checkbox时生效，设置是否合并成一个标签[3.16.0新增]
  maxTimeLength?: number; // type=dateRange/datetimeRange时生效，设置用户只能选择某个时间跨度，只接受毫秒数[3.16.0新增]
  slotName?: string; // type=custom时生效，用于指定二级面板的插槽名[3.16.0新增]，对应的编辑态自定义面板插槽名为item.slotName + '-edit'[注：编辑态只有3.19.0版本及以上才有]
  groupKey?: string; // 自定义分组名，默认为：'0' [3.16.0新增]
  [propName: string]: any;
}

type ISearchBoxTagType = 'radio' | 'noValue' | 'checkbox' | 'map' | 'numRange' | 'dateRange' | 'datetimeRange' | 'custom'; // custom类型为3.16.0新增
`
    },
    {
      name: 'ISearchBoxOption',
      type: 'interface',
      code: `
interface ISearchBoxOption {
  label: string; // 选项显示值
  field?: string; // 搜索目标字段，只有'label'才需要
  allValues?: boolean; // 控制map类型二级选项是否出现内置所有值，map类型需要
  emptyValue?: boolean; // 控制map类型二级选项是否出现内置空值，map类型需要
  options?: Array<any>; // map类型二级选项数据
  [propName: string]: any;
}
`
    },
    {
      name: 'ISearchBoxTag',
      type: 'interface',
      code: `
interface ISearchBoxTag {
  field: string;
  label: string;
  value: string;
  type: ISearchBoxTagType;
  start?: number | string;
  end?: number | string;
  operator?: string; // 分隔符[3.14.0新增]
  [propName: string]: any;
}
`
    },
    {
      name: 'ISearchBoxMatchItem',
      type: 'interface',
      code: `
interface ISearchBoxMatchItem {
  label: string;
  field: string;
  value: string;
  type?: string;
}
`
    },
    {
      name: 'ISearchBoxMatchOptions',
      type: 'interface',
      code: `
interface ISearchBoxMatchOptions {
  getMatchList: (arg1: string) => ISearchBoxMatchItem[];
}
`
    },
    {
      name: 'ISearchBoxNewTag',
      type: 'interface',
      code: `
interface ISearchBoxNewTag {
  type: string;
  field: string;
  label: string;
  value: string;
  start?: string | number;
  end?: string | number;
  id?: string | number;
  operator?: string;
  options?: ISearchBoxTag[];
}
`
    },
    {
      name: 'ISearchBoxSize',
      type: 'type',
      code: `
type ISearchBoxSize = '' | 'small';
`
    }
  ]
}
