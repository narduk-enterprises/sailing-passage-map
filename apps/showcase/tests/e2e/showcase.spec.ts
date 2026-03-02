import { test, expect } from './fixtures'

test.describe('showcase', () => {
  test('page loads without hydration errors', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Nuxt 4 Showcase/i })).toBeVisible()
  })

  test('hero renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Nuxt 4 Showcase/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Source' })).toBeVisible()
  })

  test('all example cards render', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Authentication' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Marketing' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'OG Images' })).toBeVisible()
  })

  test('cards link to correct URLs', async ({ page }) => {
    await page.goto('/')
    const authCard = page.getByRole('link', { name: /Authentication/ }).first()
    await expect(authCard).toHaveAttribute('href', /localhost:3011/)
    const blogCard = page.getByRole('link', { name: /Blog/ }).first()
    await expect(blogCard).toHaveAttribute('href', /localhost:3012/)
    const marketingCard = page.getByRole('link', { name: /Marketing/ }).first()
    await expect(marketingCard).toHaveAttribute('href', /localhost:3013/)
    const dashboardCard = page.getByRole('link', { name: /Dashboard/ }).first()
    await expect(dashboardCard).toHaveAttribute('href', /localhost:3014/)
  })

  test('cards open in new tab', async ({ page }) => {
    await page.goto('/')
    const authCard = page.getByRole('link', { name: /Authentication/ }).first()
    await expect(authCard).toHaveAttribute('target', '_blank')
    await expect(authCard).toHaveAttribute('rel', 'noopener')
  })
})
