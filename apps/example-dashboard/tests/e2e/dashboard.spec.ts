import { test, expect } from './fixtures'

test.describe('example-dashboard', () => {
  test('unauthenticated redirect to auth login', async ({ page }) => {
    test.setTimeout(15_000)
    await page.goto('/')
    await expect(page).toHaveURL(/localhost:3011\/login/, { timeout: 10_000 })
  })

  test('redirect lands on auth app login page with expected content', async ({ page }) => {
    test.setTimeout(15_000)
    await page.goto('/')
    await expect(page).toHaveURL(/localhost:3011\/login/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible()
  })

  test('login page has email and password fields', async ({ page }) => {
    test.setTimeout(15_000)
    await page.goto('/')
    await expect(page).toHaveURL(/localhost:3011\/login/, { timeout: 15_000 })
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••').first()).toBeVisible()
  })

  test('auth app sign up link is present after redirect', async ({ page }) => {
    test.setTimeout(15_000)
    await page.goto('/')
    await expect(page).toHaveURL(/localhost:3011\/login/, { timeout: 15_000 })
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible()
  })
})
