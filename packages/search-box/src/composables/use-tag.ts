import { ref } from 'vue'
import { showDropdown } from '../utils/dropdown'
import { emitChangeModelEvent } from '../utils/tag'

export function useTag({ props, state, emits }) {
  const lastInputValue = ref(state.inputValue)

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
    changeIsChecked(tag)
    const newValue = props.modelValue.filter((item) => item !== tag)
    emitChangeModelEvent({ emits, state, newValue })
  }

  const clearTag = () => {
    props.modelValue.forEach((item) => changeIsChecked(item))
    state.propItem = {}
    state.inputValue = ''
    emitChangeModelEvent({ emits, state, newValue: [] })
    showDropdown(state, false)
  }

  const backspaceDeleteTag = () => {
    if (state.inputValue) {
      return
    }
    if (state.propItem.label) {
      state.propItem = {}
      return
    }
    if (lastInputValue.value === '' && state.inputValue === '') {
      const lastIndex = props.modelValue.length - 1
      changeIsChecked(props.modelValue[lastIndex])
      const newValue = state.innerModelValue.slice(0, props.modelValue.length - 1)
      emitChangeModelEvent({ emits, state, newValue })
    }
    lastInputValue.value = state.inputValue
  }

  return {
    deleteTag,
    clearTag,
    backspaceDeleteTag
  }
}
