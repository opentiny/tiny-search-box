import { expect, test } from '@playwright/test'

test('input 输入型 - 有 options 时走 radio 面板选择', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/input-type')

  const tags = page.locator('.tvp-search-box__tag')
  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })

  // 打开一级面板，选择 input 类型且有 options 的字段
  await input.click()
  await page.locator('div').filter({ hasText: /^备注$/ }).nth(2).click()

  // 应该展示 radio 风格的二级面板（second-level-panel 中 input 类型走 radio 分支）
  await expect(page.locator('.tvp-search-box__radio-wrap')).toBeVisible()

  // 选择一个选项，生成标签
  await page.locator('li').filter({ hasText: 'normal' }).click()
  await expect(tags).toHaveCount(1)
  await expect(tags.last()).toHaveText('备注 : normal')
  await expect(tags.last()).toHaveAttribute('title', '备注 : normal')
})

test('input 输入型 - 无 options 时不显示 loading（回归 hasBackupList 误判）', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/input-type')

  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })

  // 选择无 options 的 input 字段
  await input.click()
  await page.locator('div').filter({ hasText: /^描述$/ }).nth(2).click()

  // 不应出现 loading 加载状态（hasBackupList 对无 options 的 input 应为 false）
  await expect(page.locator('.tvp-search-box__loading-box')).not.toBeVisible()
})

test('input 输入型 - 无 options 时直接输入值', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/input-type')

  const tags = page.locator('.tvp-search-box__tag')
  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })

  // 选择 input 类型且无 options 的字段
  await input.click()
  await page.locator('div').filter({ hasText: /^描述$/ }).nth(2).click()

  // 直接输入值并回车
  await page.getByRole('textbox', { name: '添加筛选条件' }).fill('hello')
  await page.getByRole('textbox', { name: '添加筛选条件' }).press('Enter')
  await expect(tags).toHaveCount(1)
  await expect(tags.last()).toHaveText('描述 : hello')
})

test('input 输入型 - 搜索选项（isShowSearchOption）对 input 类型生效', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/input-type')

  const tags = page.locator('.tvp-search-box__tag')
  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })

  // 选择有 options 的 input 字段
  await input.click()
  await page.locator('div').filter({ hasText: /^备注$/ }).nth(2).click()

  // 输入值后应出现「搜索"xxx"」选项（first-level-panel isShowSearchOption 对 input 生效）
  const searchInput = page.getByRole('textbox', { name: '添加筛选条件' })
  await searchInput.fill('custom-value')
  await expect(page.locator('.tvp-search-box__dropdown-item-init')).toBeVisible()

  // 点击搜索选项生成标签
  await page.locator('.tvp-search-box__dropdown-item-init').click()
  await expect(tags).toHaveCount(1)
  await expect(tags.last()).toHaveText('备注 : custom-value')
})

test('input 输入型 - 创建标签后下拉框关闭（回归 inputValue watch 删除）', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/input-type')

  const tags = page.locator('.tvp-search-box__tag')
  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })

  // 选择有 options 的 input 字段，从二级面板选择后下拉框应关闭
  await input.click()
  await page.locator('div').filter({ hasText: /^备注$/ }).nth(2).click()
  await page.locator('li').filter({ hasText: 'urgent' }).click()
  await expect(tags).toHaveCount(1)

  // 下拉框应该已关闭（visible 状态为 false）
  await expect(page.locator('.tvp-search-box__radio-wrap')).not.toBeVisible()

  // 再次选择无 options 的 input 字段，输入后回车，下拉框也应关闭
  await page.getByRole('textbox', { name: '添加筛选条件' }).click()
  await page.locator('div').filter({ hasText: /^描述$/ }).nth(2).click()
  await page.getByRole('textbox', { name: '添加筛选条件' }).fill('test')
  await page.getByRole('textbox', { name: '添加筛选条件' }).press('Enter')
  await expect(tags).toHaveCount(2)
  await expect(page.locator('.tvp-search-box__dropdown-item-init')).not.toBeVisible()
})

test('input 输入型 - radio 类型与 input 类型行为一致（有 options）', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/input-type')

  const tags = page.locator('.tvp-search-box__tag')
  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })

  // 选择 radio 类型字段
  await input.click()
  await page.locator('div').filter({ hasText: /^单选字段$/ }).nth(2).click()
  await expect(page.locator('.tvp-search-box__radio-wrap')).toBeVisible()
  await page.locator('li').filter({ hasText: '选项A' }).click()
  await expect(tags).toHaveCount(1)
  await expect(tags.last()).toHaveText('单选字段 : 选项A')

  // 选择 input 类型字段（有 options），应展示同样的 radio 面板
  await page.getByRole('textbox', { name: '添加筛选条件' }).click()
  await page.locator('div').filter({ hasText: /^备注$/ }).nth(2).click()
  await expect(page.locator('.tvp-search-box__radio-wrap')).toBeVisible()
  await page.locator('li').filter({ hasText: 'normal' }).click()
  await expect(tags).toHaveCount(2)
  await expect(tags.last()).toHaveText('备注 : normal')
})
