import { createNewTag, getTagId } from './tag.ts'
import { isNumber, omitObj } from './index.ts'
import { toDate } from './date.ts'

/**
 * 比较两个日期值的大小，返回 -1/0/1
 * 兼容字符串、时间戳、Date 对象，避免字符串字典序在自定义 format 或带时区时误判
 * 传入 dateFormat 时按格式严格解析（支持 yyyy年MM月dd日 等本地化格式），
 * 任一无法解析时返回 NaN，避免被误判为相等（导致倒序/相等范围误判）
 * @param a 日期值
 * @param b 日期值
 * @param dateFormat 可选，按指定格式解析字符串
 * @returns a<b 返回 -1，a>b 返回 1，相等返回 0，无法解析返回 NaN
 */
export const compareDate = (a, b, dateFormat) => {
  const ta = toDate(a, dateFormat)?.getTime()
  const tb = toDate(b, dateFormat)?.getTime()
  if (ta == null || isNaN(ta) || tb == null || isNaN(tb)) return NaN
  if (ta < tb) return -1
  if (ta > tb) return 1
  return 0
}

/**
 * 直接运行 state.formRules 中的校验规则，不依赖 tiny-form 的 validateField。
 * 兼容 validator 函数和 required + message 两种规则格式。
 * 校验结果（错误信息）写入 state.formErrors，模板据此显示错误提示。
 * @param state searchbox 的 state
 * @param fieldNames 需要校验的字段名数组
 * @returns 全部通过返回 true，否则返回 false
 */
export const runFieldValidation = (state, fieldNames) => {
  const errors = { ...state.formErrors }
  let allValid = true

  for (const fieldName of fieldNames) {
    const rule = state.formRules?.[fieldName]
    if (!rule) {
      errors[fieldName] = ''
      continue
    }

    const value = state[fieldName]
    let errorMsg = ''

    // 处理 required 规则
    if (rule.required) {
      const isEmpty = value == null || value === '' || (Array.isArray(value) && value.length === 0)
      if (isEmpty) {
        errorMsg = rule.message || ''
      }
    }

    // 处理 validator 函数
    if (!errorMsg && typeof rule.validator === 'function') {
      rule.validator({}, value, (err) => {
        if (err) {
          errorMsg = err.message || ''
        }
      })
    }

    errors[fieldName] = errorMsg
    if (errorMsg) {
      allValid = false
    }
  }

  state.formErrors = errors
  return allValid
}

/**
 * 清除指定字段的校验错误信息
 * @param state searchbox 的 state
 * @param fieldNames 需要清除错误信息的字段名数组
 */
export const clearFormErrors = (state, fieldNames) => {
  const errors = { ...state.formErrors }
  for (const field of fieldNames) {
    errors[field] = ''
  }
  state.formErrors = errors
}

/**
 * 校验正常标签的值，并返回相应的新标签
 * @param instance searchbox 的 instance
 * @param state searchbox 的 state
 * @param props searchbox 的 props
 * @return 验证通过则返回新标签对象，否则返回null
 */
export const getVerifyTag = async (instance, state, props) => {
  const { prevItem, inputEditValue } = state
  const { operators } = prevItem
  const rest = omitObj(prevItem)
  let newTag = null

  const isPass = runFieldValidation(state, ['inputEditValue'])

  if (isPass) {
    let id = null
    const operator = state.operatorValue && operators ? { operator: state.operatorValue } : null
    let value = inputEditValue
    const otherAttr = {}
    // 多选
    if (Array.isArray(inputEditValue)) {
      otherAttr.options = []
      value = ''
      inputEditValue.forEach((editValue) => {
        const item = state.currentEditValue.find((item) => item.label === editValue)
        const label = item?.label || editValue
        value = !value ? label : `${value} | ${label}`
        if (item) {
          const itemId = getTagId(props, prevItem, item)
          otherAttr.options.push({ label, ...itemId })
        } else {
          otherAttr.options.push({ label })
        }
      })
    } else if (Array.isArray(state.currentEditValue)) {
      // 单选
      const item = state.currentEditValue.find((item) => item.label === value)
      id = getTagId(props, prevItem, item)
    }

    newTag = createNewTag({ ...rest, label: state.selectValue, ...operator, value, ...id, ...otherAttr })
  }

  return newTag
}

/**
 * 校验 numRange 的值，并返回相应的新标签
 * @param instance searchbox 的 instance
 * @param state searchbox 的 state
 * @param props searchbox 的 props
 * @return 验证通过则返回新标签对象，否则返回null
 */
export const getVerifyNumTag = async (instance, state, props) => {
  const { prevItem } = state
  const minNum = `min${prevItem.field}`
  const maxNum = `max${prevItem.field}`
  const start = state[minNum]
  const end = state[maxNum]
  const verifyProps = [minNum, maxNum]
  const isPass = runFieldValidation(state, verifyProps)
  let newTag = null

  if (isPass) {
    const { field, label: prevLabel, unit, type, operators } = prevItem
    const label = unit ? `${prevLabel}(${unit})` : prevLabel
    let value = ''
    if (start && end) {
      value = `${start}-${end}`
    } else {
      value = start ? `≥${start}` : `≤${end}`
    }
    const id = getTagId(props, prevItem, prevItem)
    const operator = state.operatorValue && operators ? { operator: state.operatorValue } : null
    newTag = createNewTag({ type, field, label, value, ...id, start, end, ...operator })
  }

  return newTag
}

/**
 * 校验 dateRange datetimeRange 的值，并返回相应的新标签
 * @param instance searchbox 的 instance
 * @param state searchbox 的 state
 * @param props searchbox 的 props
 * @param isDateTimeType 是否 datetimeRange
 * @return 验证通过则返回新标签对象，否则返回null
 */
export const getVerifyDateTag = async (instance, state, props, isDateTimeType) => {
  const { prevItem, startDate, endDate, startDateTime, endDateTime } = state
  let start = null
  let end = null
  let newTag = null
  let verifyProps = null
  if (isDateTimeType) {
    start = startDateTime
    end = endDateTime
    verifyProps = ['startDateTime', 'endDateTime']
  } else {
    start = startDate
    end = endDate
    verifyProps = ['startDate', 'endDate']
  }

  const isPass = runFieldValidation(state, verifyProps)

  if (isPass) {
    const { operators } = prevItem
    const rest = omitObj(prevItem)
    let value = ''
    const dateFormat = prevItem.format || (isDateTimeType ? state.datetimeRangeFormat : state.dateRangeFormat)
    if (start && end) {
      if (compareDate(start, end, dateFormat) > 0) {
        return
      } else if (compareDate(start, end, dateFormat) === 0) {
        value = start
      } else {
        value = `${start}-${end}`
      }
    } else {
      value = start ? `≥${start}` : `≤${end}`
    }
    const id = getTagId(props, prevItem, prevItem)
    const operator = state.operatorValue && operators ? { operator: state.operatorValue } : null
    newTag = createNewTag({ ...rest, value, start, end, ...id, ...operator })
  }

  return newTag
}

/**
 * 按需加载 state 里 numRange 类型的变量，按需加载校验规则
 * @param state searchbox 的 state
 * @param item 当前选择的 item 值
 */
export const setStateNumRange = (state, item, t) => {
  const { prevItem } = state
  const { field, start, end, min = prevItem.min, max = prevItem.max } = item
  const nextMinNum = `min${field}`
  const nextMaxNum = `max${field}`
  if (state.curMinNumVar !== nextMinNum || state.curMaxNumVar !== nextMaxNum) {
    delete state[state.curMinNumVar]
    delete state[state.curMaxNumVar]
    delete state.formRules[state.curMinNumVar]
    delete state.formRules[state.curMaxNumVar]
    state.curMinNumVar = nextMinNum
    state.curMaxNumVar = nextMaxNum
  }
  state[state.curMinNumVar] = start
  state[state.curMaxNumVar] = end
  const { curMinNumVar, curMaxNumVar } = state
  const minIsNumber = isNumber(min)
  const maxIsNumber = isNumber(max)
  if (minIsNumber || maxIsNumber) {
    state.formRules[curMinNumVar] = {
      validator: (rule, value, cb) => {
        const valueIsNumber = isNumber(value)

        if (
          (!valueIsNumber && isNumber(state[curMaxNumVar])) ||
          (valueIsNumber &&
            ((minIsNumber && !maxIsNumber && value >= min) ||
              (!minIsNumber && maxIsNumber && value <= max) ||
              (value >= min && value <= max)))
        ) {
          cb()
        } else {
          state.numberShowMessage = Boolean(value || state[curMaxNumVar])
          cb(new Error(t('tvp.tvpSearchbox.rangeMinErr', [min, max])))
        }
      }
    }
    state.formRules[curMaxNumVar] = {
      validator: (rule, value, cb) => {
        const MinValueIsNumber = isNumber(state[curMinNumVar])
        const curMin = MinValueIsNumber && min < state[curMinNumVar] ? Number(state[curMinNumVar]) : min
        const curMinIsNumber = isNumber(curMin)
        const valueIsNumber = isNumber(value)

        if (
          (!valueIsNumber && MinValueIsNumber) ||
          (valueIsNumber &&
            ((curMinIsNumber && !maxIsNumber && value >= curMin) ||
              (!curMinIsNumber && maxIsNumber && value <= max) ||
              (value >= curMin && value <= max)))
        ) {
          cb()
        } else if (!valueIsNumber && !MinValueIsNumber) {
          cb(new Error(t('tvp.tvpSearchbox.rangeNumberTitle')))
        } else {
          cb(new Error(t('tvp.tvpSearchbox.rangeMaxErr')))
        }
      }
    }
  } else {
    state.formRules[curMaxNumVar] = {
      validator: (rule, value, cb) => {
        const curMin = state[curMinNumVar]
        const valueIsNumber = isNumber(value)
        const curMinIsNumber = isNumber(curMin)

        if (
          (valueIsNumber && !curMinIsNumber) ||
          (!valueIsNumber && curMinIsNumber) ||
          (valueIsNumber && curMinIsNumber && value >= Number(curMin))
        ) {
          cb()
        } else if (!valueIsNumber && !curMinIsNumber) {
          cb(new Error(t('tvp.tvpSearchbox.rangeNumberTitle')))
        } else {
          cb(new Error(t('tvp.tvpSearchbox.rangeMaxErr')))
        }
      }
    }
  }
}
