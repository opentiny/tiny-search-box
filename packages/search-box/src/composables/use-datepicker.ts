import { showDropdown } from '../utils/dropdown.ts'
import { getVerifyDateTag } from '../utils/validate.ts'
import { emitChangeModelEvent } from '../utils/tag.ts'

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
  const internalDisabledDate = (time, startDate, endName) => {
    const { maxTimeLength = 0, min, max } = state.prevItem

    const endDate = state[endName]
    const curTime = time.getTime()
    // 有限制时间跨度timeLength时
    if (maxTimeLength > 0) {
      if (min || max) {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          const start = !min && max ? end - maxTimeLength : Math.max(min.getTime(), end - maxTimeLength)
          return curTime < start || curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          const end = min && !max ? start + maxTimeLength : Math.min(max.getTime(), start + maxTimeLength)
          return curTime < start || curTime > end
        } else {
          return (min && curTime < min.getTime()) || (max && curTime > max.getTime())
        }
      } else {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          const start = end - maxTimeLength
          return curTime < start || curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          const end = start + maxTimeLength
          return curTime < start || curTime > end
        } else {
          return false
        }
      }
    } else {
      if (min || max) {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          return (min && curTime < min.getTime()) || curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          return curTime < start || (max && curTime > max.getTime())
        } else {
          return curTime < min || curTime > max
        }
      } else {
        if (endName && endDate) {
          const end = new Date(endDate).getTime()
          return curTime > end
        } else if (!endName && startDate) {
          const start = new Date(startDate).getTime()
          return curTime < start
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
