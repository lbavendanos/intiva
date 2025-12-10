import { expect, test } from '@playwright/test'

test.describe('Products Page', () => {
  test('should display the products page title', async ({ page }) => {
    await page.goto('/products')

    await expect(page.locator('h1')).toHaveText('Productos')
    await expect(
      page.getByText('Explora nuestra colección completa de productos.'),
    ).toBeVisible()
  })

  test('should show product grid when products exist', async ({ page }) => {
    await page.goto('/products')

    const productCards = page.locator('[data-testid="product-card"]')
    const count = await productCards.count()

    if (count > 0) {
      await expect(productCards.first()).toBeVisible()
    }
  })

  test('should show empty state when no products exist', async ({ page }) => {
    await page.goto('/products')

    const productCards = page.locator('[data-testid="product-card"]')
    const count = await productCards.count()

    if (count === 0) {
      await expect(page.getByText('No se encontraron productos')).toBeVisible()
    }
  })

  test('should have valid product links', async ({ page }) => {
    await page.goto('/products')

    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      const firstProductHref = await productLinks.first().getAttribute('href')
      expect(firstProductHref).toMatch(/^\/product\/[\w-]+$/)
    }
  })

  test('should handle pagination if available', async ({ page }) => {
    await page.goto('/products')

    // Check if pagination exists
    const nextButton = page.getByRole('link', { name: /siguiente/i })
    const isNextEnabled = await nextButton.isVisible().catch(() => false)

    if (isNextEnabled) {
      await nextButton.click()
      await expect(page).toHaveURL(/cursor=/)
    }
  })
})

test.describe('Products Page - Loading States', () => {
  test('should render without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })
})

test.describe('Products Page - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/products')

    await expect(page.locator('h1')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/products')

    await expect(page.locator('h1')).toBeVisible()
  })
})
