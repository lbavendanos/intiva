import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  extractNodesFromEdges,
  formatMoney,
  ShopifyClientError,
  storefrontQuery,
} from '@/lib/shopify/client'

const mockFetch = vi.fn()

describe('Shopify Client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    global.fetch = mockFetch
    process.env = {
      ...originalEnv,
      SHOPIFY_STORE_DOMAIN: 'test-store.myshopify.com',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: 'test-token',
      APP_LOCALE: 'es-PE',
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  describe('storefrontQuery', () => {
    it('should create client with correct headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { products: [] } }),
      })

      await storefrontQuery('query { products { id } }')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('test-store.myshopify.com'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': 'test-token',
          }),
        }),
      )
    })

    it('should handle GraphQL errors correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            errors: [
              { message: 'Invalid query' },
              { message: 'Field not found' },
            ],
          }),
      })

      await expect(storefrontQuery('query { invalid }')).rejects.toThrow(
        'GraphQL errors: Invalid query, Field not found',
      )
    })

    it('should throw on network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'))

      await expect(
        storefrontQuery('query { products { id } }'),
      ).rejects.toThrow(
        'Network error while fetching from Shopify: Network failure',
      )
    })

    it('should throw on HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(
        storefrontQuery('query { products { id } }'),
      ).rejects.toThrow('HTTP error from Shopify: 500 Internal Server Error')
    })

    it('should throw on invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(
        storefrontQuery('query { products { id } }'),
      ).rejects.toThrow('Invalid JSON response from Shopify')
    })

    it('should throw when no data is returned', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await expect(
        storefrontQuery('query { products { id } }'),
      ).rejects.toThrow('No data returned from Shopify')
    })

    it('should throw when store domain is missing', async () => {
      delete process.env.SHOPIFY_STORE_DOMAIN

      await expect(
        storefrontQuery('query { products { id } }'),
      ).rejects.toThrow('Missing SHOPIFY_STORE_DOMAIN')
    })

    it('should throw when access token is missing', async () => {
      delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

      await expect(
        storefrontQuery('query { products { id } }'),
      ).rejects.toThrow('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN')
    })

    it('should pass variables to the request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { product: { id: '1' } } }),
      })

      await storefrontQuery(
        'query GetProduct($handle: String!) { product(handle: $handle) { id } }',
        {
          variables: { handle: 'test-product' },
        },
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"handle":"test-product"'),
        }),
      )
    })
  })

  describe('ShopifyClientError', () => {
    it('should create error with message', () => {
      const error = new ShopifyClientError('Test error')
      expect(error.message).toBe('Test error')
      expect(error.name).toBe('ShopifyClientError')
    })

    it('should create error with GraphQL errors', () => {
      const graphqlErrors = [{ message: 'Error 1' }, { message: 'Error 2' }]
      const error = new ShopifyClientError('Test error', graphqlErrors)
      expect(error.errors).toEqual(graphqlErrors)
    })
  })

  describe('extractNodesFromEdges', () => {
    it('should extract nodes from edges array', () => {
      const connection = {
        edges: [
          { node: { id: '1', name: 'Product 1' } },
          { node: { id: '2', name: 'Product 2' } },
        ],
      }

      const result = extractNodesFromEdges(connection)

      expect(result).toEqual([
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ])
    })

    it('should return empty array for undefined connection', () => {
      const result = extractNodesFromEdges(undefined)
      expect(result).toEqual([])
    })

    it('should return empty array for null connection', () => {
      const result = extractNodesFromEdges(null)
      expect(result).toEqual([])
    })

    it('should return empty array for connection without edges', () => {
      const result = extractNodesFromEdges({ edges: [] })
      expect(result).toEqual([])
    })
  })

  describe('formatMoney', () => {
    it('should format currency using APP_LOCALE', () => {
      const money = { amount: '99.99', currencyCode: 'USD' }
      const result = formatMoney(money)
      // es-PE locale formats with currency code
      expect(result).toContain('99.99')
      expect(result).toMatch(/USD|US\$|\$/)
    })

    it('should format EUR currency with APP_LOCALE', () => {
      const money = { amount: '149.50', currencyCode: 'EUR' }
      const result = formatMoney(money)
      expect(result).toContain('149.50')
      expect(result).toMatch(/EUR|€/)
    })

    it('should handle whole numbers', () => {
      const money = { amount: '100.00', currencyCode: 'USD' }
      const result = formatMoney(money)
      expect(result).toContain('100.00')
    })

    it('should use fallback locale when APP_LOCALE is not set', () => {
      delete process.env.APP_LOCALE
      const money = { amount: '99.99', currencyCode: 'USD' }
      const result = formatMoney(money)
      // en-US locale uses period for decimal and $ symbol
      expect(result).toBe('$99.99')
    })

    it('should respect different locales', () => {
      process.env.APP_LOCALE = 'en-US'
      const money = { amount: '1234.56', currencyCode: 'USD' }
      const result = formatMoney(money)
      expect(result).toBe('$1,234.56')
    })

    it('should format with es-ES locale', () => {
      process.env.APP_LOCALE = 'es-ES'
      const money = { amount: '1234.56', currencyCode: 'EUR' }
      const result = formatMoney(money)
      // es-ES uses comma for decimal separator
      expect(result).toMatch(/1\.?234,56/)
      expect(result).toContain('€')
    })
  })
})
