import { expect, test } from '@playwright/test'

test.describe('Collections Page', () => {
  test('should display the collections page title', async ({ page }) => {
    await page.goto('/collections')

    await expect(page.locator('h1')).toHaveText('Colecciones')
    await expect(
      page.getByText('Explora nuestras colecciones de productos.'),
    ).toBeVisible()
  })

  test('should show collection grid when collections exist', async ({ page }) => {
    await page.goto('/collections')

    const collectionCards = page.locator('[data-testid="collection-card"]')
    const count = await collectionCards.count()

    if (count > 0) {
      await expect(collectionCards.first()).toBeVisible()
    }
  })

  test('should show empty state when no collections exist', async ({ page }) => {
    await page.goto('/collections')

    const collectionCards = page.locator('[data-testid="collection-card"]')
    const count = await collectionCards.count()

    if (count === 0) {
      await expect(
        page.getByText('No se encontraron colecciones'),
      ).toBeVisible()
    }
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

  test('should handle pagination if available', async ({ page }) => {
    await page.goto('/collections')

    // Check if pagination exists
    const nextButton = page.getByRole('link', { name: /siguiente/i })
    const isNextEnabled = await nextButton.isVisible().catch(() => false)

    if (isNextEnabled) {
      await nextButton.click()
      await expect(page).toHaveURL(/cursor=/)
    }
  })
})

test.describe('Collection Detail Page', () => {
  test('should navigate to collection detail from collections list', async ({
    page,
  }) => {
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      const firstCollectionHref = await collectionLinks
        .first()
        .getAttribute('href')
      await collectionLinks.first().click()

      await expect(page).toHaveURL(firstCollectionHref!)
      // Wait for the page to load and check the main heading
      await expect(
        page.locator('[data-testid="collection-title"]'),
      ).toBeVisible()
    }
  })

  test('should display collection title', async ({ page }) => {
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      await collectionLinks.first().click()
      await expect(
        page.locator('[data-testid="collection-title"]'),
      ).toBeVisible()
    }
  })

  test('should show products in collection detail when products exist', async ({
    page,
  }) => {
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      await collectionLinks.first().click()

      // Wait for Suspense to resolve
      await page.waitForLoadState('networkidle')

      const productCards = page.locator('[data-testid="product-card"]')
      const productCount = await productCards.count()

      if (productCount > 0) {
        await expect(productCards.first()).toBeVisible()
      }
    }
  })

  test('should show empty state in collection detail when no products exist', async ({
    page,
  }) => {
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      await collectionLinks.first().click()

      // Wait for Suspense to resolve
      await page.waitForLoadState('networkidle')

      const productCards = page.locator('[data-testid="product-card"]')
      const productCount = await productCards.count()

      if (productCount === 0) {
        await expect(
          page.getByText('No se encontraron productos'),
        ).toBeVisible()
      }
    }
  })

  test('should handle pagination in collection detail', async ({ page }) => {
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      await collectionLinks.first().click()

      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Check if pagination exists
      const nextButton = page.getByRole('link', { name: /siguiente/i })
      const isNextEnabled = await nextButton.isVisible().catch(() => false)

      if (isNextEnabled) {
        await nextButton.click()
        await expect(page).toHaveURL(/cursor=/)
      }
    }
  })

  test('should show 404 page for non-existent collection', async ({ page }) => {
    await page.goto('/collections/non-existent-collection-xyz')

    // Verify 404 page content is shown
    await expect(
      page.getByText(/404|not found|no encontrado/i).first(),
    ).toBeVisible()
  })
})

test.describe('Collections Page - Loading States', () => {
  test('should render without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/collections')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('collection detail should render without JavaScript errors', async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      await collectionLinks.first().click()
      await page.waitForLoadState('networkidle')

      expect(errors).toHaveLength(0)
    }
  })
})

test.describe('Collections Page - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/collections')

    await expect(page.locator('h1')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/collections')

    await expect(page.locator('h1')).toBeVisible()
  })

  test('collection detail should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/collections')

    const collectionLinks = page.locator('a[href^="/collections/"]')
    const count = await collectionLinks.count()

    if (count > 0) {
      await collectionLinks.first().click()
      await expect(
        page.locator('[data-testid="collection-title"]'),
      ).toBeVisible()
    }
  })
})
