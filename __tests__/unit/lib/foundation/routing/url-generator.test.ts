import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getUrlGenerator,
  resetUrlGenerator,
  UrlGenerator,
} from '@/lib/foundation/routing/url-generator'

describe('UrlGenerator', () => {
  describe('class', () => {
    it('should create instance with root URL', () => {
      const generator = new UrlGenerator('https://example.com')

      expect(generator.getRoot()).toBe('https://example.com')
    })

    describe('to', () => {
      it('should generate URL with default path', () => {
        const generator = new UrlGenerator('https://example.com')

        const result = generator.to()

        expect(result.href).toBe('https://example.com/')
      })

      it('should generate URL with specific path', () => {
        const generator = new UrlGenerator('https://example.com')

        const result = generator.to('/products')

        expect(result.href).toBe('https://example.com/products')
      })

      it('should generate URL with nested path', () => {
        const generator = new UrlGenerator('https://example.com')

        const result = generator.to('/collections/summer-2024')

        expect(result.href).toBe('https://example.com/collections/summer-2024')
      })

      it('should generate URL with query parameters', () => {
        const generator = new UrlGenerator('https://example.com')

        const result = generator.to('/products?page=2&sort=price')

        expect(result.href).toBe(
          'https://example.com/products?page=2&sort=price',
        )
      })

      it('should handle path without leading slash', () => {
        const generator = new UrlGenerator('https://example.com')

        const result = generator.to('products')

        expect(result.href).toBe('https://example.com/products')
      })

      it('should handle root URL with trailing slash', () => {
        const generator = new UrlGenerator('https://example.com/')

        const result = generator.to('/products')

        expect(result.href).toBe('https://example.com/products')
      })

      it('should return URL object', () => {
        const generator = new UrlGenerator('https://example.com')

        const result = generator.to('/products')

        expect(result).toBeInstanceOf(URL)
        expect(result.pathname).toBe('/products')
        expect(result.origin).toBe('https://example.com')
      })
    })

    describe('getRoot / setRoot', () => {
      it('should get the root URL', () => {
        const generator = new UrlGenerator('https://example.com')

        expect(generator.getRoot()).toBe('https://example.com')
      })

      it('should set a new root URL', () => {
        const generator = new UrlGenerator('https://example.com')

        generator.setRoot('https://newsite.com')

        expect(generator.getRoot()).toBe('https://newsite.com')
      })

      it('should use new root URL when generating URLs', () => {
        const generator = new UrlGenerator('https://example.com')

        generator.setRoot('https://newsite.com')
        const result = generator.to('/products')

        expect(result.href).toBe('https://newsite.com/products')
      })
    })
  })

  describe('getUrlGenerator', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      resetUrlGenerator()
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_APP_URL: 'https://example.com',
      }
    })

    afterEach(() => {
      process.env = originalEnv
      resetUrlGenerator()
    })

    it('should return a UrlGenerator instance', () => {
      const generator = getUrlGenerator()

      expect(generator).toBeInstanceOf(UrlGenerator)
    })

    it('should use NEXT_PUBLIC_APP_URL as root', () => {
      const generator = getUrlGenerator()

      expect(generator.getRoot()).toBe('https://example.com')
    })

    it('should return the same instance on subsequent calls', () => {
      const generator1 = getUrlGenerator()
      const generator2 = getUrlGenerator()

      expect(generator1).toBe(generator2)
    })

    it('should throw error when NEXT_PUBLIC_APP_URL is not defined', () => {
      delete process.env.NEXT_PUBLIC_APP_URL

      expect(() => getUrlGenerator()).toThrow(
        'NEXT_PUBLIC_APP_URL environment variable is not defined. Please set it in your .env file.',
      )
    })
  })

  describe('resetUrlGenerator', () => {
    const originalEnv = process.env

    beforeEach(() => {
      vi.resetModules()
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_APP_URL: 'https://example.com',
      }
    })

    afterEach(() => {
      process.env = originalEnv
      resetUrlGenerator()
    })

    it('should create a new instance after reset', () => {
      const generator1 = getUrlGenerator()
      generator1.setRoot('https://modified.com')

      resetUrlGenerator()

      const generator2 = getUrlGenerator()
      expect(generator2.getRoot()).toBe('https://example.com')
    })
  })
})
