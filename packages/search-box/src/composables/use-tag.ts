import { showDropdown } from '../utils/dropdown.ts'
import { emitChangeModelEvent } from '../utils/tag.ts'
import { deepClone } from '../utils/index.ts'

export function useTag({ props, state, emit, nextTick, isTagDisabled }) {
  let lastInputValue = deepClone(state.inputValue)

  const changeIsChecked = (tag) => {
    if (tag) {
      const parent = state.recordItems.find((item) => item.label === tag.label)
      if (parent && parent.options) {
        const child = parent.options.find((item) => item.label === tag.value)
        child && (child.isChecked = false)
      }
    }
  }

  const deleteTag = (tag) => {
    if (isTagDisabled(tag)) return
    showDropdown(state, false)
    changeIsChecked(tag)
    const newValue = props.modelValue.filter((item) => item !== tag)
    emitChangeModelEvent({ emit, state, nextTick, newValue })
  }

  const clearTag = () => {
    // 仅清除可删除的标签，保留被禁用删除的标签
    const remaining = props.modelValue.filter((item) => isTagDisabled(item))
    if (remaining.length === props.modelValue.length) return
    showDropdown(state, false)
    props.modelValue.forEach((item) => {
      if (!isTagDisabled(item)) changeIsChecked(item)
    })
    state.propItem = {}
    state.inputValue = ''
    emitChangeModelEvent({ emit, state, nextTick, newValue: remaining })
    emit('clear')
  }

  const backspaceDeleteTag = () => {
    if (state.inputValue) {
      return
    }
    if (state.propItem.label) {
      state.propItem = {}
      return
    }
    if (lastInputValue === '' && state.inputValue === '') {
      const lastIndex = props.modelValue.length - 1
      const lastTag = props.modelValue[lastIndex]
      // 最后一个标签禁止删除时，跳过退格删除
      if (lastTag && isTagDisabled(lastTag)) {
        return
      }
      showDropdown(state, false)
      changeIsChecked(lastTag)
      const newValue = state.innerModelValue.slice(0, props.modelValue.length - 1)
      emitChangeModelEvent({ emit, state, nextTick, newValue })
    }
    lastInputValue = state.inputValue
    if (state?.instance?.refs?.inputRef?.$el) {
      state.instance.refs.inputRef.$el.click()
    }
  }

  return {
    deleteTag,
    clearTag,
    backspaceDeleteTag
  }
}
