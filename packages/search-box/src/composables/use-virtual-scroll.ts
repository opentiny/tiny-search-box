/**
 * 轻量级一维列表虚拟滚动 composable
 * 适用于固定行高的下拉列表场景
 *
 * @param hooks - renderless hooks (提供 reactive, computed)
 * @param options.getList - 返回完整列表的函数
 * @param options.itemHeight - 每行高度（默认 32px，与 tiny-dropdown-item 一致）
 * @param options.bufferSize - 视口外额外渲染的行数（默认 5）
 * @param options.headerHeight - 返回容器内非列表头部高度的函数（默认 () => 0）
 */
export function useVirtualScroll(hooks, options) {
  const { reactive, computed } = hooks
  const { getList, itemHeight = 32, bufferSize = 5, headerHeight = () => 0 } = options

  const vsState = reactive({
    scrollTop: 0,
    viewportHeight: 300
  })

  const totalHeight = computed(() => {
    const list = getList() || []
    return list.length * itemHeight
  })

  const startIndex = computed(() => {
    const adjustedScrollTop = Math.max(0, vsState.scrollTop - headerHeight())
    return Math.max(0, Math.floor(adjustedScrollTop / itemHeight) - bufferSize)
  })

  const endIndex = computed(() => {
    const list = getList() || []
    const visibleCount = Math.ceil(vsState.viewportHeight / itemHeight)
    return Math.min(list.length, startIndex.value + visibleCount + bufferSize * 2)
  })

  const offsetY = computed(() => startIndex.value * itemHeight)

  const visibleItems = computed(() => {
    const list = getList() || []
    return list.slice(startIndex.value, endIndex.value)
  })

  const handleScroll = (e) => {
    vsState.scrollTop = e.target.scrollTop
    vsState.viewportHeight = e.target.clientHeight
  }

  return {
    vsState,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
    visibleItems,
    handleScroll
  }
}
