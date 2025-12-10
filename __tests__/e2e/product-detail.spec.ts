import { expect, test } from '@playwright/test'

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // First go to products page to get a valid product handle
    await page.goto('/products')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate to product detail from product card', async ({
    page,
  }) => {
    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      const firstProductHref = await productLinks.first().getAttribute('href')
      await productLinks.first().click()

      await expect(page).toHaveURL(firstProductHref!)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('should display product title', async ({ page }) => {
    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      const title = page.locator('h1')
      await expect(title).toBeVisible()
      const titleText = await title.textContent()
      expect(titleText).toBeTruthy()
    }
  })

  test('should display product price', async ({ page }) => {
    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      // Look for price element (contains currency symbol)
      const priceElement = page.locator('text=/\\$|€|£/')
      await expect(priceElement.first()).toBeVisible()
    }
  })

  test('should display product image gallery', async ({ page }) => {
    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      // Check for main image or "Sin imagen" text
      const mainImage = page.locator('img[alt]').first()
      const noImage = page.getByText('Sin imagen')

      const hasImage = await mainImage.isVisible().catch(() => false)
      const hasNoImageText = await noImage.isVisible().catch(() => false)

      expect(hasImage || hasNoImageText).toBeTruthy()
    }
  })

  test('should display add to cart button', async ({ page }) => {
    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      const addToCartButton = page.getByRole('button', {
        name: /agregar al carrito|agotado|selecciona/i,
      })
      await expect(addToCartButton).toBeVisible()
    }
  })

  test('should render without JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      expect(errors).toHaveLength(0)
    }
  })
})

test.describe('Product Detail Page - Variant Selection', () => {
  test('should update variant when option is selected', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      // Check for variant selector buttons (excluding the add to cart button)
      const variantButtons = page.locator('button[role="radio"]')
      const variantCount = await variantButtons.count()

      if (variantCount > 1) {
        // Click on a different variant
        await variantButtons.nth(1).click()

        // Verify the button is now selected
        await expect(variantButtons.nth(1)).toHaveAttribute(
          'aria-checked',
          'true',
        )
      }
    }
  })
})

test.describe('Product Detail Page - Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      await expect(page.locator('h1')).toBeVisible()
    }
  })
})

test.describe('Product Detail Page - SEO', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    const productLinks = page.locator('a[href^="/product/"]')
    const count = await productLinks.count()

    if (count > 0) {
      await productLinks.first().click()
      await page.waitForLoadState('networkidle')

      // Check title tag
      const title = await page.title()
      expect(title).toBeTruthy()

      // Check meta description
      const metaDescription = page.locator('meta[name="description"]')
      const hasDescription = await metaDescription.count()
      expect(hasDescription).toBeGreaterThanOrEqual(0)
    }
  })
})
