import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getCollectionByHandle,
  getCollectionProducts,
  getCollections,
} from '@/lib/shopify/queries/collections'

const mockFetch = vi.fn()

describe('Collections Queries', () => {
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

  describe('getCollections', () => {
    it('should fetch collections with pagination', async () => {
      const mockCollections = {
        data: {
          collections: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Collection/1',
                  title: 'Test Collection',
                  handle: 'test-collection',
                  description: 'A test collection',
                  image: {
                    url: 'https://example.com/collection.jpg',
                    altText: 'Collection image',
                    width: 800,
                    height: 600,
                  },
                },
              },
            ],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: 'cursor1',
              endCursor: 'cursor2',
            },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCollections),
      })

      const result = await getCollections(12)

      expect(result.collections).toHaveLength(1)
      expect(result.collections[0].title).toBe('Test Collection')
      expect(result.pageInfo.hasNextPage).toBe(true)
    })

    it('should pass after cursor for pagination', async () => {
      const mockCollections = {
        data: {
          collections: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCollections),
      })

      await getCollections(12, 'cursor123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"after":"cursor123"'),
        }),
      )
    })

    it('should return empty array when no collections', async () => {
      const mockCollections = {
        data: {
          collections: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCollections),
      })

      const result = await getCollections()

      expect(result.collections).toEqual([])
    })
  })

  describe('getCollectionByHandle', () => {
    it('should fetch collection by handle', async () => {
      const mockCollection = {
        data: {
          collection: {
            id: 'gid://shopify/Collection/1',
            title: 'Test Collection',
            handle: 'test-collection',
            description: 'A test collection',
            descriptionHtml: '<p>A test collection</p>',
            image: {
              url: 'https://example.com/collection.jpg',
              altText: 'Collection image',
              width: 800,
              height: 600,
            },
            seo: { title: 'Test Collection', description: 'SEO description' },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCollection),
      })

      const result = await getCollectionByHandle('test-collection')

      expect(result).not.toBeNull()
      expect(result?.title).toBe('Test Collection')
      expect(result?.handle).toBe('test-collection')
    })

    it('should return null when collection not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { collection: null } }),
      })

      const result = await getCollectionByHandle('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getCollectionProducts', () => {
    it('should fetch collection with products', async () => {
      const mockResponse = {
        data: {
          collection: {
            id: 'gid://shopify/Collection/1',
            title: 'Test Collection',
            handle: 'test-collection',
            description: 'A test collection',
            descriptionHtml: '<p>A test collection</p>',
            image: {
              url: 'https://example.com/collection.jpg',
              altText: 'Collection image',
              width: 800,
              height: 600,
            },
            seo: { title: 'Test Collection', description: 'SEO description' },
            products: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/Product/1',
                    title: 'Test Product',
                    handle: 'test-product',
                    availableForSale: true,
                    priceRange: {
                      minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
                    },
                    featuredImage: {
                      url: 'https://example.com/product.jpg',
                      altText: 'Product image',
                      width: 800,
                      height: 600,
                    },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: 'cursor1',
                endCursor: 'cursor2',
              },
            },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await getCollectionProducts('test-collection')

      expect(result.collection).not.toBeNull()
      expect(result.collection?.title).toBe('Test Collection')
      expect(result.products).toHaveLength(1)
      expect(result.products[0].title).toBe('Test Product')
    })

    it('should return empty result when collection not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { collection: null } }),
      })

      const result = await getCollectionProducts('non-existent')

      expect(result.collection).toBeNull()
      expect(result.products).toEqual([])
      expect(result.pageInfo.hasNextPage).toBe(false)
    })

    it('should pass pagination variables', async () => {
      const mockResponse = {
        data: {
          collection: {
            id: 'gid://shopify/Collection/1',
            title: 'Test Collection',
            handle: 'test-collection',
            description: 'A test collection',
            descriptionHtml: '<p>A test collection</p>',
            image: null,
            seo: { title: null, description: null },
            products: {
              edges: [],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null,
              },
            },
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      await getCollectionProducts('test-collection', 24, 'cursor123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"first":24'),
        }),
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"after":"cursor123"'),
        }),
      )
    })
  })
})
