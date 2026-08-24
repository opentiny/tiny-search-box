/**
 * 下拉框显隐
 * @param state 组件响应式数据
 * @param isShow 是否展示下拉框, 默认展示
 */
export const showDropdown = (state, isShow = true) => {
  clearTimeout(state.visibleTimer)
  state.visibleTimer = null
  if (isShow) {
    if (!state.visible) {
      state.visibleTimer = setTimeout(() => {
        state.visible = true
      }, 0)
    }
  } else {
    // 关闭前重置虚拟滚动：此时 popper 仍然可见，DOM 元素可访问，
    // vsInstance 有效。在隐藏前把 scrollTop 归零，下次打开同类型
    // 面板时就不会因残留滚动位置而空白。
    // （second-level-panel 的 watch(() => state.visible) 不触发，
    //   所以只能在关闭时——而非打开时——重置）
    if (state.visible && typeof document !== 'undefined') {
      // 1. 重置 DOM scrollTop，触发原生 scroll 事件更新 vsState
      //    限定在当前实例的 popperElm 范围内，避免多实例互相影响
      const popperElm = state.instance?.$refs?.dropdownRef?.state?.popperElm
      const container = popperElm || document
      container
        .querySelectorAll('.tvp-search-box__virtual-list')
        .forEach((el) => {
          el.scrollTop = 0
        })
      // 2. 关闭前将焦点从下拉面板内移出，避免 popover 设置
      //    aria-hidden 后其后代 li 仍持有焦点而触发无障碍警告
      const active = document.activeElement as HTMLElement | null
      if (active?.closest?.('.tvp-search-box__dropdown-menu')) {
        state.instance?.$refs?.inputRef?.focus?.()
      }
    }
    state.visible = false
  }
}

/**
 * 编辑下拉框显隐
 * @param state 组件响应式数据
 * @param isShow 是否展示编辑下拉框, 默认展示
 */
export const showPopover = (state, isShow = true) => {
  if (!state.instance) return
  state.popoverVisible = isShow
  const { dropdownRef } = state.instance

  if (isShow && dropdownRef.state.visible) {
    clearTimeout(Number(dropdownRef.state.timeout))
    dropdownRef.state.timeout = null
    dropdownRef.state.visible = false
  }
}
