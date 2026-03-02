import { test, expect } from './fixtures'

const BLOG_BASE = 'http://localhost:3012'

async function waitForBlogReady(): Promise<void> {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BLOG_BASE, { method: 'HEAD' })
      if (res.ok) return
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('Blog server at 3012 did not become ready in time')
}

test.describe('example-blog', () => {
  test.beforeAll(async () => {
    await waitForBlogReady()
  })

  test('page loads without hydration errors on index', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Our Blog' })).toBeVisible()
  })

  test('blog index renders with heading and subtitle', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Our Blog' })).toBeVisible()
    await expect(page.getByText('Thoughts, updates, and tutorials.')).toBeVisible()
  })

  test('blog index shows post cards when content exists', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Our Blog' })).toBeVisible()
    const postLinks = page.locator('a[href*="hello-world"], a[href*="d1-and-content"]')
    await expect(postLinks.first()).toBeVisible({ timeout: 15_000 })
  })

  test('navigate to post and see content', async ({ page }) => {
    await page.goto('/hello-world')
    await expect(page).toHaveURL(/\/hello-world/)
    await expect(page.getByRole('heading', { name: 'Hello World: Building for the Edge' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/Nuxt 4|Welcome to the/)).toBeVisible()
  })

  test('post page loads without hydration errors', async ({ page }) => {
    await page.goto('/hello-world')
    await expect(page.getByRole('heading', { name: 'Hello World: Building for the Edge' })).toBeVisible({ timeout: 10_000 })
  })

  test('blog layout navigation to index', async ({ page }) => {
    await page.goto('/hello-world')
    await expect(page.getByRole('heading', { name: 'Hello World: Building for the Edge' })).toBeVisible({ timeout: 10_000 })
    await page.getByRole('link', { name: 'Blog', exact: true }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Our Blog' })).toBeVisible()
  })

  test('404 for unknown slug', async ({ page }) => {
    const res = await page.goto('/nonexistent-post', { waitUntil: 'commit', timeout: 15_000 })
    expect(res?.status()).toBe(404)
  })
})
