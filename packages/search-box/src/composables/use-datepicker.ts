import { showDropdown } from '../utils/dropdown.ts'
import { getVerifyDateTag } from '../utils/validate.ts'
import { emitChangeModelEvent } from '../utils/tag.ts'

// 获取某天的起始时间戳（00:00:00.000），用于 datetime 类型按天禁用日期
const getStartOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function useDatePicker({ props, state, emit, nextTick, vm }) {
  const instance = vm || state.instance
  const onConfirmDate = async (confirm: boolean, isDateTimeType = false) => {
    if (!confirm) {
      state.propItem = { label: '' }  

      return
    }
    const newTag = await getVerifyDateTag(instance, state, props, isDateTimeType)
    if (newTag) {
      showDropdown(state, false)
      const newValue = props.modelValue.filter((prev) => prev.type !== newTag.type || prev.field !== newTag.field)
      newValue.push(newTag)
      emitChangeModelEvent({ emit, state, nextTick, newValue })
    } else {
      showDropdown(state)
    }
  }

  const handleDateShow = () => showDropdown(state)

  // 内部 disabledDate 逻辑：依据 maxTimeLength / min / max 及已选起止时间计算禁用日期
  // datetime 类型按天禁用日期，避免开始时间非 00:00:00 时结束时间无法选择当天
  const internalDisabledDate = (time, startDate, endName) => {
    const { maxTimeLength = 0, min, max } = state.prevItem
    const isDateTime = state.prevItem.type === 'datetimeRange'
    // min / max 支持 number | Date，统一转为时间戳，避免对 number 调用 getTime 报错
    const minTime = min ? (typeof min === 'number' ? min : min.getTime()) : null
    const maxTime = max ? (typeof max === 'number' ? max : max.getTime()) : null
    // datetimeRange 下界按天对齐，避免 min 带具体时刻导致当天被误禁
    const minLower = minTime == null ? null : isDateTime ? getStartOfDay(minTime) : minTime

    const endDate = state[endName]
    const curTime = time.getTime()
    // 有限制时间跨度timeLength时
    if (maxTimeLength > 0) {
      if (min || max) {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          const start = !min && max ? end - maxTimeLength : Math.max(minTime, end - maxTimeLength)
          const lower = isDateTime ? getStartOfDay(start) : start
          return curTime < lower || curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          const end = min && !max ? start + maxTimeLength : Math.min(maxTime, start + maxTimeLength)
          const lower = isDateTime ? getStartOfDay(start) : start
          return curTime < lower || curTime > end
        } else {
          return (minLower && curTime < minLower) || (maxTime && curTime > maxTime)
        }
      } else {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          const start = end - maxTimeLength
          const lower = isDateTime ? getStartOfDay(start) : start
          return curTime < lower || curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          const end = start + maxTimeLength
          const lower = isDateTime ? getStartOfDay(start) : start
          return curTime < lower || curTime > end
        } else {
          return false
        }
      }
    } else {
      if (min || max) {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          return (minLower && curTime < minLower) || curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          const lower = isDateTime ? getStartOfDay(start) : start
          return curTime < lower || (maxTime && curTime > maxTime)
        } else {
          return (minLower && curTime < minLower) || (maxTime && curTime > maxTime)
        }
      } else {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          return curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          const lower = isDateTime ? getStartOfDay(start) : start
          return curTime < lower
        } else {
          return false
        }
      }
    }
  }

  // 合并用户在 item 上配置的 pickerOptions（支持 shortcuts / firstDayOfWeek / onPick / disabledDate 等）
  const pickerOptions = (startDate, endName = '') => {
    const internalDisable = (time) => internalDisabledDate(time, startDate, endName)
    const userPickerOptions = state.prevItem.pickerOptions || {}
    const result: any = { ...userPickerOptions }

    const userDisabledDate = userPickerOptions.disabledDate
    result.disabledDate =
      typeof userDisabledDate === 'function'
        ? (time) => internalDisable(time) || userDisabledDate(time)
        : internalDisable

    return result
  }

  return {
    onConfirmDate,
    handleDateShow,
    pickerOptions
  }
}
