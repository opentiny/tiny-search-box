import { expect, test } from '@playwright/test'

test('事件', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/events')

  const container = page.locator('#events')
  const tags = page.locator('.tvp-search-box__tag')
  const texts = ['changeEvent: ', 'changeEvent: ', 'searchEvent: ', 'changeEvent: ', 'onClear']
  let i = 0

  page.on('console', (msg) => {
    if (msg.type() === 'log') {
      expect(msg.text()).toContain(texts[i])
    }
    i++
  })

  await page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' }).click()
  await page.locator('li').filter({ hasText: '名称' }).locator('div').nth(1).click()
  await page.locator('div').filter({ hasText: 'vpc-1' }).nth(3).click()
  await expect(tags).toHaveCount(1)
  await expect(tags.last()).toHaveText('名称 : vpc-1')
  await expect(tags.last()).toHaveAttribute('title', '名称 : vpc-1')

  await page.getByRole('textbox', { name: '添加筛选条件' }).click()
  await page.locator('div').filter({ hasText: '状态' }).nth(2).click()
  await page.getByText('运行中').click()
  await page.getByRole('button', { name: '确认' }).click()
  await expect(tags.last()).toHaveText('状态 : 运行中')

  await container.getByRole('textbox', { name: '添加筛选条件' }).press('Enter')
  await container.locator('.tvp-search-box__input-close').click()
})

test('asyncLoading - 异步加载时空数组显示 loading，数据到达后消失', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/events')

  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })
  await input.click()
  // 选择声明了 asyncLoading: true 的字段（名称，options: []）
  await page.locator('li').filter({ hasText: '名称' }).first().locator('div').nth(1).click()

  // asyncLoading: true 且 options 为空数组，应显示 loading
  await expect(page.locator('.tvp-search-box__loading-box')).toBeVisible()

  // 异步数据到达后（setTimeout 1s），loading 消失
  await expect(page.locator('.tvp-search-box__loading-box')).not.toBeVisible({ timeout: 5000 })
})

test('无 asyncLoading - 空数组 options 不显示 loading（回归测试）', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('/examples/events')

  const input = page.getByRole('textbox', { name: '选择属性筛选，或输入关键字搜索' })
  await input.click()
  // 选择 options 为空数组但未声明 asyncLoading 的字段（名称2）
  await page.locator('li').filter({ hasText: '名称2' }).locator('div').nth(1).click()

  // 不应出现 loading（未声明 asyncLoading，空数组不触发 loading）
  await expect(page.locator('.tvp-search-box__loading-box')).not.toBeVisible()
})
