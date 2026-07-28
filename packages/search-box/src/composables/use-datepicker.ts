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

  const pickerOptions = (startDate, endName = '') => ({
    disabledDate(time) {
      const { maxTimeLength = 0, min, max } = state.prevItem
      // datetime 类型按天禁用日期，避免开始时间非 00:00:00 时结束时间无法选择当天
      const isDateTime = state.prevItem.type === 'datetimeRange'

      const endDate = state[endName]
      const curTime = time.getTime()
      // 有限制时间跨度timeLength时
      if (maxTimeLength > 0) {
        if (min || max) {
          if (endName && endDate) {
            const end = new Date(endDate).getTime()
            const start = !min && max ? end - maxTimeLength : Math.max(min.getTime(), end - maxTimeLength)
            const lower = isDateTime ? getStartOfDay(start) : start
            return curTime < lower || curTime > end
          } else if (!endName && startDate) {
            const start = new Date(startDate).getTime()
            const end = min && !max ? start + maxTimeLength : Math.min(max.getTime(), start + maxTimeLength)
            const lower = isDateTime ? getStartOfDay(start) : start
            return curTime < lower || curTime > end
          } else {
            return (min && curTime < min.getTime()) || (max && curTime > max.getTime())
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
            return (min && curTime < min.getTime()) || curTime > end
          } else if (!endName && startDate) {
            const start = new Date(startDate).getTime()
            const lower = isDateTime ? getStartOfDay(start) : start
            return curTime < lower || (max && curTime > max.getTime())
          } else {
            return curTime < min || curTime > max
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
  })

  return {
    onConfirmDate,
    handleDateShow,
    pickerOptions
  }
}
