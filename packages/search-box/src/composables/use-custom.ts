import { resetInput, emitChangeModelEvent, hasTagItem } from '../utils/tag'
import { showDropdown, showPopover } from '../utils/dropdown'

export function useCustom({ state, emits }) {
  const updateCustomValue = (customTag) => {
    showDropdown(state, false)
    const { prevItem, indexMap } = state
    const { replace, label } = prevItem

    const tagList = []
    if (replace && indexMap.has(label)) {
      const index = indexMap.get(label)
      const newTag = { ...prevItem, ...customTag }
      emitChangeModelEvent({ emits, state, newTag, index })

      return
    } else if (!replace && Array.isArray(customTag)) {
      customTag.forEach((tag) => {
        if (!hasTagItem(state, tag.value)) {
          tagList.push({ ...prevItem, ...tag })
        }
      })
    } else {
      if (!hasTagItem(state, customTag.value)) {
        tagList.push({ ...prevItem, ...customTag })
      }
    }
    emitChangeModelEvent({ emits, state, tagList })
  }

  const handleConfirm = (customTag) => {
    if (!customTag) {
      resetInput(state)
      showDropdown(state, false)
      return
    }

    updateCustomValue(customTag)
  }

  const handleEditConfirm = (customTag) => {
    if (!customTag) {
      showPopover(state, false)
      return
    }

    updateCustomValue(customTag)
  }

  return {
    handleConfirm,
    handleEditConfirm
  }
}
