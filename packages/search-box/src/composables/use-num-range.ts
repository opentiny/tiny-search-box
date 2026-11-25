import { showDropdown } from '../utils/dropdown.ts'
import { getVerifyNumTag, compareDate } from '../utils/validate.ts'
import { emitChangeModelEvent } from '../utils/tag.ts'

export function useNumRange({ props, state, t, emit, nextTick, vm }) {
  const instance = vm || state.instance
  const sizeChange = async (confirm: boolean) => {
    if (!confirm) {
      state.propItem = { ...state.propItem, label: '' }
      return
    }

    const newTag = await getVerifyNumTag(instance, state, props)
    if (newTag) {
      showDropdown(state, false)
      const newValue = props.modelValue.filter((prev) => prev.type !== newTag.type || prev.field !== newTag.field)
      newValue.push(newTag)
      emitChangeModelEvent({ emit, state, nextTick, newValue })
    } else {
      showDropdown(state)
    }
  }

  /**
   * 创建 type=dateRange 和 type = datetimeRange 的校验规则
   * @param startKey 校验的开始日期名
   * @param endKey 校验的结束日期名
   */
  const createDateRules = (item, startKey, endKey) => {
    const { maxTimeLength = 0 } = item
    return {
      [startKey]: {
        validator: (rule, value, cb) => {
          if (maxTimeLength > 0 && !value) {
            cb(new Error(t('tvp.tvpSearchbox.notBeNull')))
          } else if (!value && !state[endKey]) {
            cb(new Error(t('tvp.tvpSearchbox.rangeDateTitle')))
          } else {
            cb()
          }
        }
      },
      [endKey]: {
        validator: (rule, value, cb) => {
          if (maxTimeLength > 0 && !value) {
            cb(new Error(t('tvp.tvpSearchbox.notBeNull')))
          } else if (!value && !state[startKey]) {
            cb(new Error(t('tvp.tvpSearchbox.rangeDateTitle')))
          } else if (value && state[startKey] && compareDate(value, state[startKey]) < 0) {
            cb(new Error(t('tvp.tvpSearchbox.rangeDateMaxErr')))
          } else {
            cb()
          }
        }
      }
    }
  }

  const initFormRule = () => {
    let dateRules = {},
      datetimeRules = {}
    props.items.forEach((item) => {
      if (item.type === 'dateRange') {
        dateRules = createDateRules(item, 'startDate', 'endDate')
      }

      if (item.type === 'datetimeRange') {
        datetimeRules = createDateRules(item, 'startDateTime', 'endDateTime')
      }
    })
    state.formRules = {
      ...dateRules,
      ...datetimeRules
    }
    if (props.editable) {
      state.formRules.inputEditValue = {
        required: true,
        message: t('tvp.tvpSearchbox.notBeNull'),
        trigger: ['change', 'blur']
      }
      // 编辑面板值输入与主输入框 maxlength 行为对齐：单选校验字符串长度，多选(mergeTag)逐项校验
      if (props.maxlength) {
        state.formRules.inputEditValue.validator = (rule, value, cb) => {
          const values = Array.isArray(value) ? value : [value]
          const isExceeded = values.some((item) => typeof item === 'string' && item.length > props.maxlength)
          if (isExceeded) {
            cb(new Error(t('tvp.tvpSearchbox.maxlengthErr', [props.maxlength])))
          } else {
            cb()
          }
        }
      }
      // map 类型编辑：key/value 均为必选，避免确认时静默失败
      state.formRules.mapEditKey = {
        required: true,
        message: t('tvp.tvpSearchbox.notBeNull'),
        trigger: ['change']
      }
      state.formRules.mapEditValue = {
        required: true,
        message: t('tvp.tvpSearchbox.notBeNull'),
        trigger: ['change']
      }
    }
  }

  return {
    initFormRule,
    sizeChange
  }
}
