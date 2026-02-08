import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  addToCart,
  createCart,
  removeFromCart,
  updateCartLines,
} from '@/lib/shopify/storefront/mutations/cart'

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

describe('Cart Mutations', () => {
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

  describe('createCart', () => {
    it('should create an empty cart', async () => {
      const emptyCartResponse = {
        ...mockCartResponse,
        totalQuantity: 0,
        lines: { edges: [] },
        cost: {
          subtotalAmount: { amount: '0', currencyCode: 'USD' },
          totalAmount: { amount: '0', currencyCode: 'USD' },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartCreate: {
                cart: emptyCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      const result = await createCart()

      expect(result.cart).not.toBeNull()
      expect(result.cart?.id).toBe('gid://shopify/Cart/123')
      expect(result.cart?.totalQuantity).toBe(0)
      expect(result.userErrors).toEqual([])
    })

    it('should create a cart with lines', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartCreate: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      const result = await createCart([
        { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 2 },
      ])

      expect(result.cart).not.toBeNull()
      expect(result.cart?.totalQuantity).toBe(2)
      expect(result.cart?.lines).toHaveLength(1)
    })

    it('should return user errors when cart creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartCreate: {
                cart: null,
                userErrors: [
                  {
                    field: ['input', 'lines', '0', 'merchandiseId'],
                    message: 'Variant not found',
                    code: 'INVALID',
                  },
                ],
              },
            },
          }),
      })

      const result = await createCart([
        { merchandiseId: 'invalid-id', quantity: 1 },
      ])

      expect(result.cart).toBeNull()
      expect(result.userErrors).toHaveLength(1)
      expect(result.userErrors[0].message).toBe('Variant not found')
    })

    it('should pass lines input to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartCreate: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      await createCart([
        { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 2 },
      ])

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            '"merchandiseId":"gid://shopify/ProductVariant/1"',
          ),
        }),
      )
    })
  })

  describe('addToCart', () => {
    it('should add lines to existing cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesAdd: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      const result = await addToCart('gid://shopify/Cart/123', [
        { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 },
      ])

      expect(result.cart).not.toBeNull()
      expect(result.userErrors).toEqual([])
    })

    it('should pass cartId and lines to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesAdd: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      await addToCart('gid://shopify/Cart/123', [
        { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 },
      ])

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"cartId":"gid://shopify/Cart/123"'),
        }),
      )
    })

    it('should return user errors when adding fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesAdd: {
                cart: null,
                userErrors: [
                  {
                    field: ['lines', '0'],
                    message: 'Cannot add more items',
                    code: 'INVALID',
                  },
                ],
              },
            },
          }),
      })

      const result = await addToCart('gid://shopify/Cart/123', [
        { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 100 },
      ])

      expect(result.cart).toBeNull()
      expect(result.userErrors).toHaveLength(1)
    })
  })

  describe('updateCartLines', () => {
    it('should update line quantities', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesUpdate: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      const result = await updateCartLines('gid://shopify/Cart/123', [
        { id: 'gid://shopify/CartLine/1', quantity: 3 },
      ])

      expect(result.cart).not.toBeNull()
      expect(result.userErrors).toEqual([])
    })

    it('should pass cartId and lines to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesUpdate: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      await updateCartLines('gid://shopify/Cart/123', [
        { id: 'gid://shopify/CartLine/1', quantity: 5 },
      ])

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"quantity":5'),
        }),
      )
    })

    it('should return user errors when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesUpdate: {
                cart: null,
                userErrors: [
                  {
                    field: ['lines', '0', 'quantity'],
                    message: 'Quantity exceeds available stock',
                    code: 'INVALID',
                  },
                ],
              },
            },
          }),
      })

      const result = await updateCartLines('gid://shopify/Cart/123', [
        { id: 'gid://shopify/CartLine/1', quantity: 1000 },
      ])

      expect(result.cart).toBeNull()
      expect(result.userErrors).toHaveLength(1)
    })
  })

  describe('removeFromCart', () => {
    it('should remove lines from cart', async () => {
      const cartAfterRemoval = {
        ...mockCartResponse,
        totalQuantity: 0,
        lines: { edges: [] },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesRemove: {
                cart: cartAfterRemoval,
                userErrors: [],
              },
            },
          }),
      })

      const result = await removeFromCart('gid://shopify/Cart/123', [
        'gid://shopify/CartLine/1',
      ])

      expect(result.cart).not.toBeNull()
      expect(result.cart?.lines).toHaveLength(0)
      expect(result.userErrors).toEqual([])
    })

    it('should pass cartId and lineIds to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesRemove: {
                cart: mockCartResponse,
                userErrors: [],
              },
            },
          }),
      })

      await removeFromCart('gid://shopify/Cart/123', [
        'gid://shopify/CartLine/1',
        'gid://shopify/CartLine/2',
      ])

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"lineIds"'),
        }),
      )
    })

    it('should return user errors when removal fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              cartLinesRemove: {
                cart: null,
                userErrors: [
                  {
                    field: ['lineIds', '0'],
                    message: 'Line not found',
                    code: 'NOT_FOUND',
                  },
                ],
              },
            },
          }),
      })

      const result = await removeFromCart('gid://shopify/Cart/123', [
        'invalid-line-id',
      ])

      expect(result.cart).toBeNull()
      expect(result.userErrors).toHaveLength(1)
    })
  })
})
