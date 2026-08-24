import { emitChangeModelEvent } from '../utils/tag.ts'
import { getVerifyNumTag, getVerifyDateTag, setStateNumRange, getVerifyTag } from '../utils/validate.ts'
import { showDropdown } from '../utils/dropdown.ts'
import { deepClone } from '../utils/index.ts'

export function useEdit({ props, state, t, nextTick, format, emit, vm }) {
  const setDropdownProps = (curTag, isSwitch = false) => {
    const { operator, value, start, end } = curTag
    const { options, operators, type, mergeTag } = state.prevItem
    if (type === 'custom') {
      return
    } else if (type === 'numRange') {
      setStateNumRange(state, curTag, t)
    } else if (type === 'dateRange') {
      const { dateRangeFormat } = state
      state.startDate = format(start, dateRangeFormat)
      state.endDate = format(end, dateRangeFormat)
    } else if (type === 'datetimeRange') {
      const { datetimeRangeFormat } = state
      state.startDateTime = format(start, datetimeRangeFormat)
      state.endDateTime = format(end, datetimeRangeFormat)
    } else {
      if (mergeTag) {
        // 切换属性时清空选中值；配置项的 options 是可选项而非已选项
        const labels = isSwitch ? [] : curTag.options?.flatMap((item) => item.label) || []
        // 多选编辑态，tiny-select multiple 需要数组
        state.inputEditValue = labels
        state.currentEditSelectTags = labels
      } else {
        // 其他场景使用字符串
        state.inputEditValue = isSwitch ? '' : (Array.isArray(value) ? value.join(',') : (value || ''))
      }
      state.currentEditValue = options
    }
    state.operatorValue = operator
    state.currentOperators = operators
  }

  // 检查表单校验状态
  const checkFormValidation = async () => {
    if (!state.instance?.$refs?.formRef) {
      return
    }

    const { prevItem } = state
    let verifyProps = []

    if (prevItem.type === 'numRange') {
      verifyProps = [state.curMinNumVar, state.curMaxNumVar]
    } else if (prevItem.type === 'dateRange') {
      verifyProps = ['startDate', 'endDate']
    } else if (prevItem.type === 'datetimeRange') {
      verifyProps = ['startDateTime', 'endDateTime']
    } else if (!['custom', 'map'].includes(prevItem.type)) {
      verifyProps = ['inputEditValue']
    }

    if (verifyProps?.length === 0) {
      state.hasFormError = false
      return
    }

    let hasError = false
    await state.instance.$refs.formRef.validateField(verifyProps, (errMsg) => {
      if (errMsg) {
        hasError = true
      }
    })

    state.hasFormError = hasError
  }

  const editTag = (tag, index, e) => {
    if (!props.editable || (tag.type && tag.type === 'map')) {
      return
    }

    showDropdown(state, false)
    state.popoverVisible = false
    const dom = e.target.classList.contains('tiny-tag') ? e.target : e.srcElement.parentElement

    nextTick(() => {
      const { popoverRef } = state.instance.$refs
      popoverRef.state.referenceElm = dom
      popoverRef.state.popperElm && (popoverRef.state.popperElm.style.display = 'none')
      popoverRef.doDestroy()
      state.popoverVisible = true
      // 打开编辑面板时检查校验状态
      checkFormValidation()
    })

    state.prevItem = state.recordItems.find((item) => item.field === tag.field)
    !state.prevItem && (state.prevItem = tag)
    state.selectValue = tag.label
    state.currentModelValueIndex = index

    emit('tagClick', tag)
    setDropdownProps(tag)
  }

  const selectPropChange = (item, disabled) => {
    if (disabled) return
    state.prevItem = item
    setDropdownProps(item, true)
    // 切换属性类型时检查校验状态
    nextTick(() => {
      checkFormValidation()
    })
  }

  const confirmEditTag = async (isConfirm) => {
    if (!isConfirm) {
      state.popoverVisible = false

      return
    }

    const { prevItem, currentModelValueIndex: index } = state

    let newTag = null
    if (prevItem.type === 'numRange') {
      newTag = await getVerifyNumTag(state.instance, state, props)
    } else if (prevItem.type === 'dateRange') {
      newTag = await getVerifyDateTag(state.instance, state, props, false)
    } else if (prevItem.type === 'datetimeRange') {
      newTag = await getVerifyDateTag(state.instance, state, props, true)
    } else {
      newTag = await getVerifyTag(state.instance, state, props)
    }

    if (newTag) {
      showDropdown(state, false)
      state.popoverVisible = false

      // 当切换属性且新属性配置了 replace/mergeTag 时，需要替换掉同字段的已有 tag，
      // 而不是仅替换被编辑的位置，避免出现同字段的重复 tag
      const { replace, mergeTag } = prevItem
      const replaceIndex = state.indexMap.get(newTag.label)
      if ((replace || mergeTag) && replaceIndex !== undefined && replaceIndex !== index) {
        const oldValue = deepClone(state.innerModelValue)
        // 先删除同字段的旧 tag，再用新 tag 替换被编辑的位置
        let newValue = state.innerModelValue.filter((_, i) => i !== replaceIndex)
        const newIndex = index > replaceIndex ? index - 1 : index
        newValue[newIndex] = newTag
        emitChangeModelEvent({ emit, state, nextTick, newValue, oldValue, isEdit: true })
      } else {
        emitChangeModelEvent({ emit, state, nextTick, index, newTag, isEdit: true })
      }
    } else {
      state.popoverVisible = true
    }

    state.currentEditValue = []
  }

  const selectItemIsDisable = (item) => {
    if (item.type && item.type === 'map') {
      return true
    }

    if (state.prevItem?.operators || item.operators) {
      return state.prevItem.operators?.length !== item.operators?.length
    }

    const typeArr = ['radio', 'checkbox']
    if (state.prevItem.type && typeArr.includes(state.prevItem.type)) {
      return !item.type ? false : !typeArr.includes(item.type)
    }

    return state.prevItem?.type !== item.type
  }

  return {
    editTag,
    confirmEditTag,
    selectPropChange,
    selectItemIsDisable,
    checkFormValidation
  }
}
