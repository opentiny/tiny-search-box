/**
 * 下拉框显隐
 * @param state 组件响应式数据
 * @param isShow 是否展示下拉框, 默认展示
 */
export const showDropdown = (state, isShow = true) => {
  const { dropdownRef } = state.instance.refs
  clearTimeout(Number(dropdownRef.state.timeout))
  dropdownRef.state.timeout = null
  dropdownRef.state.visible = isShow
  isShow && (state.popoverVisible = false)
}

/**
 * 编辑下拉框显隐
 * @param state 组件响应式数据
 * @param isShow 是否展示编辑下拉框, 默认展示
 */
export const showPopover = (state, isShow = true) => {
  state.popoverVisible = isShow
  const { dropdownRef } = state.instance.refs
  if (isShow && dropdownRef.state.visible) {
    clearTimeout(Number(dropdownRef.state.timeout))
    dropdownRef.state.timeout = null
    dropdownRef.state.visible = false
  }
}
