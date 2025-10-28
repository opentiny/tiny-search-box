/**
 * 下拉框显隐
 * @param state 组件响应式数据
 * @param isShow 是否展示下拉框, 默认展示
 */
export const showDropdown = (state, isShow = true) => {
  console.info('弹窗', state, isShow)
  if (isShow) {
    state.visibleTimer = setTimeout(() => {
      state.visible = true
    }, 0)
  } else {
    clearTimeout(state.visibleTimer)
    state.visibleTimer = null
    state.visible = false
  }
}

/**
 * 编辑下拉框显隐
 * @param state 组件响应式数据
 * @param isShow 是否展示编辑下拉框, 默认展示
 */
export const showPopover = (state, isShow = true) => {
  console.info('showPopover', state, isShow)
  state.popoverVisible = isShow
  const { dropdownRef } = state
  if (isShow && dropdownRef.state.visible) {
    clearTimeout(Number(dropdownRef.state.timeout))
    dropdownRef.state.timeout = null
    dropdownRef.state.visible = false
  }
}
