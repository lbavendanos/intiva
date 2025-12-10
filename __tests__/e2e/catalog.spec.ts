import { expect, test } from '@playwright/test'

test.describe('Products Page', () => {
  test('should display the products page title', async ({ page }) => {
    await page.goto('/products')

    await expect(page.locator('h1')).toHaveText('Productos')
    await expect(
      page.getByText('Explora nuestra colección completa de productos.'),
    ).toBeVisible()
  })

  test('should show product grid or empty state', async ({ page }) => {
    await page.goto('/products')

    // Either products are shown or the empty state
    const hasProducts =
      (await page.locator('[data-testid="product-card"]').count()) > 0
    const hasEmptyState = await page
      .getByText('No se encontraron productos')
      .isVisible()
      .catch(() => false)

    expect(hasProducts || hasEmptyState).toBe(true)
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
})

test.describe('Collections Page', () => {
  test('should display the collections page title', async ({ page }) => {
    await page.goto('/collections')

    await expect(page.locator('h1')).toHaveText('Colecciones')
    await expect(
      page.getByText('Explora nuestras colecciones de productos.'),
    ).toBeVisible()
  })

  test('should show collection grid or empty state', async ({ page }) => {
    await page.goto('/collections')

    // Either collections are shown or the empty state
    const hasCollections =
      (await page.locator('[data-testid="collection-card"]').count()) > 0
    const hasEmptyState = await page
      .getByText('No se encontraron colecciones')
      .isVisible()
      .catch(() => false)

    expect(hasCollections || hasEmptyState).toBe(true)
  })

  test('should have valid collection links', async ({ page }) => {
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      const firstCollectionHref = await collectionLinks
        .first()
        .getAttribute('href')
      expect(firstCollectionHref).toMatch(/^\/collections\/[\w-]+$/)
    }
  })
})

test.describe('Navigation', () => {
  test('should navigate between products and collections', async ({ page }) => {
    // Start at products page
    await page.goto('/products')
    await expect(page.locator('h1')).toHaveText('Productos')

    // Navigate to collections
    await page.goto('/collections')
    await expect(page.locator('h1')).toHaveText('Colecciones')
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

test.describe('Loading States', () => {
  test('products page should render without JavaScript errors', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('collections page should render without JavaScript errors', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/collections')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })
})

test.describe('Responsive Design', () => {
  test('products page should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/products')

    await expect(page.locator('h1')).toBeVisible()
  })

  test('collections page should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/collections')

    await expect(page.locator('h1')).toBeVisible()
  })
})
