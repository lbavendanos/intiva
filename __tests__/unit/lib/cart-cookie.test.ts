import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteCartId, getCartId, setCartId } from '@/lib/cart-cookie'

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

describe('Cart Cookie Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getCartId', () => {
    it('should return cart id when cookie exists', async () => {
      mockCookieStore.get.mockReturnValueOnce({
        value: 'gid://shopify/Cart/123',
      })

      const result = await getCartId()

      expect(result).toBe('gid://shopify/Cart/123')
      expect(mockCookieStore.get).toHaveBeenCalledWith('cartId')
    })

    it('should return undefined when cookie does not exist', async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined)

      const result = await getCartId()

      expect(result).toBeUndefined()
    })
  })

  describe('setCartId', () => {
    it('should set cart id cookie with correct options', async () => {
      await setCartId('gid://shopify/Cart/123')

      expect(mockCookieStore.set).toHaveBeenCalledWith({
        name: 'cartId',
        value: 'gid://shopify/Cart/123',
        httpOnly: true,
        secure: false, // NODE_ENV is not 'production' in tests
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    })

    it('should set secure flag in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      await setCartId('gid://shopify/Cart/123')

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        expect.objectContaining({
          secure: true,
        }),
      )

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('deleteCartId', () => {
    it('should delete cart id cookie', async () => {
      await deleteCartId()

      expect(mockCookieStore.delete).toHaveBeenCalledWith('cartId')
    })
  })
})
