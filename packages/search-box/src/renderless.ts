// 导入工具函数和类型
import { format } from './utils/date.ts'
import { t } from './index.ts'
import { useTag } from './composables/use-tag.ts'
import { useDropdown } from './composables/use-dropdown.ts'
import { useMatch } from './composables/use-match.ts'
import { useCheckbox } from './composables/use-checkbox.ts'
import { useDatePicker } from './composables/use-datepicker.ts'
import { useNumRange } from './composables/use-num-range.ts'
import { useEdit } from './composables/use-edit.ts'
import { useCustom } from './composables/use-custom.ts'
import { useInit } from './composables/use-init.ts'
// 类型导入 - 兼容 Vue 2 和 Vue 3
import './index.type.ts'
import { showDropdown, showPopover } from './utils/dropdown.ts'

import { deepClone } from './utils/index.ts'
import { resetInput } from './utils/tag.ts'
import i18n from './utils/i18n.ts'
export const api = [
  't',
  'state',
  'placeholder',
  'isShowClose',
  'showHelp',
  'maxlength',
  'panelMaxHeight',
  'editable',
  'emptyPlaceholder',
  'deleteTag',
  'editTag',
  'backspaceDeleteTag',
  'createTag',
  'clearTag',
  'helpClick',
  'handleInput',
  'handleClick',
  'handleEvents',
  'pickerOptions',
  'resetInput',
  'selectItemIsDisable',
  'selectPropChange',
  'confirmEditTag',
  'handleConfirm',
  'handleEditConfirm',
  'showDropdown',
  'showPopover'
]

const initState = ({ reactive, computed, api, i18n, watch, props, emit, vm }) => {
  const state = reactive({
    innerModelValue: [...props.modelValue],
    recordItems: [],
    groupItems: {},
    inputValue: '',
    matchItems: {},
    propItem: {},
    backupList: [],
    filterList: [],
    checkboxGroup: [],
    prevItem: {},
    backupPrevItem: '',
    formRules: null,
    validType: 'text',
    numberShowMessage: true,
    startDate: null,
    startDateTime: null,
    endDate: null,
    endDateTime: null,
    isShowTagKey: true,
    potentialOptions: null,
    dateRangeFormat: 'yyyy/MM/dd',
    datetimeRangeFormat: 'yyyy/MM/dd HH:mm:ss',
    indexMap: new Map(),
    valueMap: new Map(),
    popoverVisible: false,
    selectValue: '',
    allTypeAttri: { label: t('tvp.tvpSearchbox.rulekeyword1'), field: 'tvpKeyword', type: 'radio' },
    operatorValue: ':',
    inputEditValue: '',
    currentOperators: '',
    currentEditValue: '',
    currentModelValueIndex: -1,
    curMinNumVar: '',
    curMaxNumVar: '',
    instance: vm,
    isMouseDown: false,
    currentEditSelectTags: [],
    visible: false,
    visibleTimer: null,
    hasBackupList: computed(() => state.propItem.label && [undefined, 'radio', 'checkbox', 'map'].includes(state.prevItem.type)),
    isIndeterminate: computed(() => state.checkboxGroup.length > 0 && state.checkboxGroup.length !== state.filterList.length),
    checkAll: computed({
      get: () => state.checkboxGroup.length && state.checkboxGroup.length === state.filterList.length,
      set: (val) => {
        if (val) {
          state.checkboxGroup = state.filterList.flatMap((item) => `${state.prevItem.label}${item.label}`)
        } else {
          state.checkboxGroup = []
        }
      }
    })
  })
  return state
}

export const renderless = (
  props,
  { getCurrentInstance, onMounted, onBeforeUnmount, computed, reactive, watch },
  { emit: $emit, nextTick, refs, vm }
) => {
  const api = {} as any
  const emit = props.emitter ? props.emitter.emit : $emit
  const state = initState({ reactive, computed, api, i18n, watch, props, emit, vm })
  let placeholder = props.emptyPlaceholder
  initAllApi({ api, state, t, props, emit, nextTick, vm, computed, placeholder })
  initWatch({ watch, state, props, api, nextTick })

  // 生命周期
  onMounted(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', api.watchOutsideClick)
      document.addEventListener('mousedown', api.watchMouseDown)
      document.addEventListener('mousemove', api.watchMouseMove)
    }
  })

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', api.watchOutsideClick)
      document.removeEventListener('mousedown', api.watchMouseDown)
      document.removeEventListener('mousemove', api.watchMouseMove)
    }
  })

  // 暴露给模板的方法
  return api
}


const initAllApi = ({ api, state, t, props, emit, nextTick, vm, computed, placeholder }) => {

  console.info('vm', vm)
  const { selectPropItem, selectRadioItem, selectInputValue, createTag, helpClick, setOperator } = useDropdown({ props, emit, state, t, format })
  const { deleteTag, clearTag, backspaceDeleteTag } = useTag({ props, state, emit })
  const { editTag, confirmEditTag, selectPropChange, selectItemIsDisable } = useEdit({ props, state, t, nextTick, format, emit })
  const { handleInput, selectFirstMap } = useMatch({ props, state, emit })
  const { selectCheckbox } = useCheckbox({ props, state, emit })
  const { onConfirmDate, handleDateShow, pickerOptions } = useDatePicker({ props, state, emit })
  const { sizeChange, initFormRule } = useNumRange({ props, state, t, emit })
  const { handleConfirm, handleEditConfirm } = useCustom({ state, emit })
  const { initItems, watchOutsideClick, watchMouseDown, watchMouseMove, handleClick } = useInit({ props, state })

  const isShowClose = computed(() => props.modelValue.length || state.propItem.label || state.inputValue)

  const eventsMap = () => ({
    selectInputValue,
    selectPropItem,
    selectRadioItem,
    setOperator,
    selectCheckbox,
    sizeChange,
    onConfirmDate,
    selectFirstMap,
    handleDateShow
  })


  const setPlaceholder = (placeholderValue: string) => {
    placeholder = placeholderValue
  }

  if (props.modelValue.length > 0) {
    setPlaceholder(t('tvp.tvpSearchbox.addPlaceholder'))
  }


  const handleEvents = (eventName, p1, p2) => {
    const map = eventsMap()
    if (typeof map[eventName] === 'function') {
      map[eventName](p1, p2)
    } else {
      console.warn(`[TinySearchBox] Unknown event: ${eventName}`)
    }
  }

  // 解构所有事件方法

  Object.assign(api, {
    t,
    state,
    placeholder,
    isShowClose,
    deleteTag,
    editTag,
    backspaceDeleteTag,
    createTag,
    clearTag,
    helpClick,
    handleInput,
    handleClick,
    handleEvents,
    pickerOptions,
    resetInput,
    selectItemIsDisable,
    selectPropChange,
    confirmEditTag,
    handleConfirm,
    handleEditConfirm,
    showDropdown,
    showPopover,
    setPlaceholder,
    initItems,
    initFormRule,
    watchOutsideClick,
    watchMouseDown,
    watchMouseMove,
    // 添加模板需要的其他属性
    showHelp: props.showHelp,
    maxlength: props.maxlength,
    panelMaxHeight: props.panelMaxHeight,
    editable: props.editable,
    modelValue: state.innerModelValue,
    emptyPlaceholder: props.emptyPlaceholder
  })
}

const initWatch = ({ watch, state, props, api, nextTick }) => {
  // 监听器
  watch(
    () => props.items,
    (newVal) => {
      state.recordItems = deepClone(newVal)
      api.initItems()
      api.initFormRule()
      nextTick(() => {
        api.initItems()
        api.initFormRule()
      })
    },
    {
      deep: true,
      immediate: true
    }
  )

  watch(
    () => state.popoverVisible,
    (newVal) => {
      if (!newVal && !state.inputEditValue.length) {
        state.inputEditValue = state.currentEditSelectTags
      }
    },
    {
      immediate: true
    }
  )

  watch(
    () => state.propItem.label,
    (newValue) => {
      if (newValue) {
        const { placeholder, type } = state.prevItem
        if (placeholder) {
          api.setPlaceholder(placeholder)
        } else if (type === 'map') {
          api.setPlaceholder(t('tvp.tvpSearchbox.tagPlaceholder'))
        } else if (state.backupList?.length) {
          api.setPlaceholder(t('tvp.tvpSearchbox.dynamicPlaceholder').replace('{newValue}', newValue))
        } else {
          api.setPlaceholder(t('tvp.tvpSearchbox.addPlaceholder'))
        }
      } else {
        if (props.modelValue.length > 0) {
          api.setPlaceholder(t('tvp.tvpSearchbox.addPlaceholder'))
        } else {
          api.setPlaceholder(props.emptyPlaceholder)
        }
      }
    }
  )

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal) {
        state.indexMap.clear()
        state.valueMap.clear()
        newVal.forEach((item, index) => {
          const value = `${item.label}${item.value}`
          state.indexMap.set(item.label, index)
          state.valueMap.set(value, index)
          if (item.options?.length > 0) {
            item.options.forEach((option) => {
              const optionValue = `${item.label}${option.label}`
              state.valueMap.set(optionValue, index)
            })
          }
        })
        showPopover(state, false)
        if (newVal.length === 0) {
          api.setPlaceholder(props.emptyPlaceholder)
        }

        if (props.editable && !state.inputEditValue.length && newVal[0]) {
          state.inputEditValue = newVal[0].value
        }
        state.innerModelValue = [...newVal]
      }
    },
    {
      deep: true,
      immediate: true
    }
  )
}