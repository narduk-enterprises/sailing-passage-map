import { test, expect } from './fixtures'

test.describe('example-apple-maps', () => {
  test('page loads and shows map or loading state', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('link', { name: 'Apple Maps Example', exact: true }),
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByText(/MapKit JS 5.x on Nuxt 4|Loading map…|Failed to load/).first(),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('map container or error is present', async ({ page }) => {
    await page.goto('/')
    const mapEl = page.getByTestId('apple-map')
    const errorOrLoading = page.getByText(/Loading map…|Failed to load/)
    await expect(mapEl.or(errorOrLoading).first()).toBeVisible({ timeout: 15_000 })
  })
})
