import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getCart } from '@/lib/shopify/queries/cart'

const mockFetch = vi.fn()

const mockCartResponse = {
  id: 'gid://shopify/Cart/123',
  checkoutUrl: 'https://store.myshopify.com/checkouts/123',
  totalQuantity: 2,
  lines: {
    edges: [
      {
        node: {
          id: 'gid://shopify/CartLine/1',
          quantity: 2,
          merchandise: {
            id: 'gid://shopify/ProductVariant/1',
            title: 'Small',
            selectedOptions: [{ name: 'Size', value: 'S' }],
            product: {
              id: 'gid://shopify/Product/1',
              title: 'Test Product',
              handle: 'test-product',
              featuredImage: {
                url: 'https://example.com/image.jpg',
                altText: 'Test image',
                width: 800,
                height: 600,
              },
            },
            price: { amount: '29.99', currencyCode: 'USD' },
            compareAtPrice: null,
          },
          cost: {
            totalAmount: { amount: '59.98', currencyCode: 'USD' },
            amountPerQuantity: { amount: '29.99', currencyCode: 'USD' },
            compareAtAmountPerQuantity: null,
          },
        },
      },
    ],
  },
  cost: {
    subtotalAmount: { amount: '59.98', currencyCode: 'USD' },
    totalAmount: { amount: '59.98', currencyCode: 'USD' },
  },
}

describe('Cart Query', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    global.fetch = mockFetch
    process.env = {
      ...originalEnv,
      SHOPIFY_STORE_DOMAIN: 'test-store.myshopify.com',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: 'test-token',
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  describe('getCart', () => {
    it('should fetch cart by id', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { cart: mockCartResponse },
          }),
      })

      const result = await getCart('gid://shopify/Cart/123')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('gid://shopify/Cart/123')
      expect(result?.totalQuantity).toBe(2)
      expect(result?.lines).toHaveLength(1)
    })

    it('should return null when cart not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { cart: null },
          }),
      })

      const result = await getCart('gid://shopify/Cart/invalid')

      expect(result).toBeNull()
    })

    it('should pass cartId variable to query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { cart: mockCartResponse },
          }),
      })

      await getCart('gid://shopify/Cart/456')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"cartId":"gid://shopify/Cart/456"'),
        })
      )
    })

    it('should transform cart lines from edges to array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { cart: mockCartResponse },
          }),
      })

      const result = await getCart('gid://shopify/Cart/123')

      expect(result?.lines).toBeInstanceOf(Array)
      expect(result?.lines[0].id).toBe('gid://shopify/CartLine/1')
      expect(result?.lines[0].merchandise.product.title).toBe('Test Product')
    })

    it('should include checkout URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { cart: mockCartResponse },
          }),
      })

      const result = await getCart('gid://shopify/Cart/123')

      expect(result?.checkoutUrl).toBe(
        'https://store.myshopify.com/checkouts/123'
      )
    })

    it('should include cost information', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { cart: mockCartResponse },
          }),
      })

      const result = await getCart('gid://shopify/Cart/123')

      expect(result?.cost.subtotalAmount.amount).toBe('59.98')
      expect(result?.cost.totalAmount.amount).toBe('59.98')
    })
  })
})
