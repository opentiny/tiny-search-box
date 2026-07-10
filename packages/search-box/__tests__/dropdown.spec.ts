import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { showDropdown, showPopover } from '../src/utils/dropdown'

describe('showDropdown', () => {
  let state

  beforeEach(() => {
    vi.useFakeTimers()
    state = {
      visible: false,
      visibleTimer: null
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('isShow=true 且当前不可见时：设置定时器并在下一 tick 显示', () => {
    showDropdown(state)

    expect(state.visibleTimer).not.toBeNull()
    expect(state.visible).toBe(false)

    vi.advanceTimersByTime(1)

    expect(state.visible).toBe(true)
  })

  it('isShow=true 且当前已可见时：不重复设置定时器', () => {
    state.visible = true
    const spy = vi.spyOn(globalThis, 'setTimeout')

    showDropdown(state)

    expect(state.visibleTimer).toBeNull()
    expect(spy).not.toHaveBeenCalled()
    expect(state.visible).toBe(true)

    spy.mockRestore()
  })

  it('isShow=false 时：清除定时器并立即隐藏', () => {
    // 先模拟一个已设置的定时器
    const timerId = setTimeout(() => {}, 1000)
    state.visibleTimer = timerId
    state.visible = true

    const spy = vi.spyOn(globalThis, 'clearTimeout')

    showDropdown(state, false)

    expect(spy).toHaveBeenCalledWith(timerId)
    expect(state.visibleTimer).toBeNull()
    expect(state.visible).toBe(false)

    spy.mockRestore()
  })

  it('连续调用 isShow=true 不产生多个定时器（回归：避免重复 setTimeout）', () => {
    showDropdown(state)
    const firstTimer = state.visibleTimer
    expect(firstTimer).not.toBeNull()

    // 不推进时间，再次调用
    showDropdown(state)
    // 之前的定时器应被清除
    expect(state.visibleTimer).not.toBe(firstTimer)
    // visible 仍为 false（定时器还没触发）
    expect(state.visible).toBe(false)

    vi.advanceTimersByTime(1)
    expect(state.visible).toBe(true)
  })

  it('先 show 后 hide：清除未触发的定时器并隐藏', () => {
    showDropdown(state) // 设置定时器
    expect(state.visibleTimer).not.toBeNull()

    showDropdown(state, false) // 在定时器触发前隐藏
    expect(state.visibleTimer).toBeNull()
    expect(state.visible).toBe(false)

    // 推进时间后 visible 仍为 false（定时器已被清除）
    vi.advanceTimersByTime(10)
    expect(state.visible).toBe(false)
  })
})

describe('showPopover', () => {
  it('state.instance 为空时不执行任何操作', () => {
    const state = { instance: null }
    expect(() => showPopover(state, true)).not.toThrow()
  })

  it('isShow=true 且 dropdownRef 可见时：关闭 dropdownRef', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const state = {
      instance: {
        dropdownRef: {
          state: {
            visible: true,
            timeout: setTimeout(() => {}, 1000)
          }
        }
      },
      popoverVisible: false
    }

    showPopover(state, true)

    expect(state.popoverVisible).toBe(true)
    expect(state.instance.dropdownRef.state.visible).toBe(false)
    expect(state.instance.dropdownRef.state.timeout).toBeNull()

    clearTimeoutSpy.mockRestore()
  })

  it('isShow=false 时：设置 popoverVisible 为 false', () => {
    const state = {
      instance: {
        dropdownRef: {
          state: {
            visible: false,
            timeout: null
          }
        }
      },
      popoverVisible: true
    }

    showPopover(state, false)
    expect(state.popoverVisible).toBe(false)
  })
})
