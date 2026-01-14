import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getProductByHandle,
  getProductRecommendations,
  getProducts,
} from '@/lib/shopify/queries/products'

const mockFetch = vi.fn()

describe('Products Queries', () => {
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

  describe('getProducts', () => {
    it('should fetch products with pagination', async () => {
      const mockProducts = {
        data: {
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
                  compareAtPriceRange: {
                    minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
                  },
                  featuredImage: {
                    url: 'https://example.com/image.jpg',
                    altText: 'Test image',
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
        json: () => Promise.resolve(mockProducts),
      })

      const result = await getProducts(12)

      expect(result.products).toHaveLength(1)
      expect(result.products[0].title).toBe('Test Product')
      expect(result.pageInfo.hasNextPage).toBe(true)
    })

    it('should pass after cursor for pagination', async () => {
      const mockProducts = {
        data: {
          products: {
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
        json: () => Promise.resolve(mockProducts),
      })

      await getProducts(12, 'cursor123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"after":"cursor123"'),
        }),
      )
    })

    it('should use default first value of 12', async () => {
      const mockProducts = {
        data: {
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
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })

      await getProducts()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"first":12'),
        }),
      )
    })

    it('should return empty array when no products', async () => {
      const mockProducts = {
        data: {
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
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      })

      const result = await getProducts()

      expect(result.products).toEqual([])
    })

    it('should compute pricing for each product', async () => {
      const mockProducts = {
        data: {
          products: {
            edges: [
              {
                node: {
                  id: 'gid://shopify/Product/1',
                  title: 'Discounted Product',
                  handle: 'discounted-product',
                  availableForSale: true,
                  priceRange: {
                    minVariantPrice: { amount: '19.99', currencyCode: 'USD' },
                  },
                  compareAtPriceRange: {
                    minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
                  },
                  featuredImage: null,
                },
              },
            ],
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
        json: () => Promise.resolve(mockProducts),
      })

      const result = await getProducts()

      expect(result.products[0].price).toEqual({
        amount: '19.99',
        currencyCode: 'USD',
      })
      expect(result.products[0].compareAtPrice).toEqual({
        amount: '29.99',
        currencyCode: 'USD',
      })
      expect(result.products[0].hasDiscount).toBe(true)
    })
  })

  describe('getProductByHandle', () => {
    it('should fetch product by handle', async () => {
      const mockProduct = {
        data: {
          product: {
            id: 'gid://shopify/Product/1',
            title: 'Test Product',
            handle: 'test-product',
            description: 'A test product',
            descriptionHtml: '<p>A test product</p>',
            availableForSale: true,
            seo: { title: 'Test Product', description: 'SEO description' },
            priceRange: {
              minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
              maxVariantPrice: { amount: '49.99', currencyCode: 'USD' },
            },
            compareAtPriceRange: {
              minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
            },
            featuredImage: {
              url: 'https://example.com/image.jpg',
              altText: 'Test image',
              width: 800,
              height: 600,
            },
            images: {
              edges: [
                {
                  node: {
                    url: 'https://example.com/image.jpg',
                    altText: 'Test image',
                    width: 800,
                    height: 600,
                  },
                },
              ],
            },
            options: [{ id: 'opt1', name: 'Size', values: ['S', 'M', 'L'] }],
            variants: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/ProductVariant/1',
                    title: 'Small',
                    availableForSale: true,
                    quantityAvailable: 10,
                    selectedOptions: [{ name: 'Size', value: 'S' }],
                    price: { amount: '29.99', currencyCode: 'USD' },
                    compareAtPrice: null,
                    image: null,
                  },
                },
              ],
            },
            tags: ['test', 'product'],
            productType: 'Test Type',
            vendor: 'Test Vendor',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })

      const result = await getProductByHandle('test-product')

      expect(result).not.toBeNull()
      expect(result?.title).toBe('Test Product')
      expect(result?.handle).toBe('test-product')
      expect(result?.images).toHaveLength(1)
      expect(result?.variants).toHaveLength(1)
    })

    it('should return null when product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { product: null } }),
      })

      const result = await getProductByHandle('non-existent')

      expect(result).toBeNull()
    })

    it('should pass handle variable to query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { product: null } }),
      })

      await getProductByHandle('my-product')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"handle":"my-product"'),
        }),
      )
    })

    it('should compute pricing for the product', async () => {
      const mockProduct = {
        data: {
          product: {
            id: 'gid://shopify/Product/1',
            title: 'Sale Product',
            handle: 'sale-product',
            description: 'A product on sale',
            descriptionHtml: '<p>A product on sale</p>',
            availableForSale: true,
            seo: { title: 'Sale Product', description: 'SEO description' },
            priceRange: {
              minVariantPrice: { amount: '49.99', currencyCode: 'USD' },
              maxVariantPrice: { amount: '49.99', currencyCode: 'USD' },
            },
            compareAtPriceRange: {
              minVariantPrice: { amount: '79.99', currencyCode: 'USD' },
            },
            featuredImage: null,
            images: { edges: [] },
            options: [],
            variants: { edges: [] },
            tags: [],
            productType: '',
            vendor: '',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })

      const result = await getProductByHandle('sale-product')

      expect(result?.price).toEqual({ amount: '49.99', currencyCode: 'USD' })
      expect(result?.compareAtPrice).toEqual({
        amount: '79.99',
        currencyCode: 'USD',
      })
      expect(result?.hasDiscount).toBe(true)
    })
  })

  describe('getProductRecommendations', () => {
    it('should fetch product recommendations', async () => {
      const mockRecommendations = {
        data: {
          productRecommendations: [
            {
              id: 'gid://shopify/Product/2',
              title: 'Recommended Product 1',
              handle: 'recommended-product-1',
              availableForSale: true,
              priceRange: {
                minVariantPrice: { amount: '19.99', currencyCode: 'USD' },
              },
              compareAtPriceRange: {
                minVariantPrice: { amount: '0', currencyCode: 'USD' },
              },
              featuredImage: {
                url: 'https://example.com/image1.jpg',
                altText: 'Recommended image 1',
                width: 800,
                height: 600,
              },
            },
            {
              id: 'gid://shopify/Product/3',
              title: 'Recommended Product 2',
              handle: 'recommended-product-2',
              availableForSale: true,
              priceRange: {
                minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
              },
              compareAtPriceRange: {
                minVariantPrice: { amount: '0', currencyCode: 'USD' },
              },
              featuredImage: null,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations),
      })

      const result = await getProductRecommendations('gid://shopify/Product/1')

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Recommended Product 1')
      expect(result[1].title).toBe('Recommended Product 2')
    })

    it('should return empty array when no recommendations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { productRecommendations: null } }),
      })

      const result = await getProductRecommendations('gid://shopify/Product/1')

      expect(result).toEqual([])
    })

    it('should pass productId and intent variables to query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { productRecommendations: null } }),
      })

      await getProductRecommendations(
        'gid://shopify/Product/1',
        'COMPLEMENTARY',
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            '"productId":"gid://shopify/Product/1"',
          ),
        }),
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"intent":"COMPLEMENTARY"'),
        }),
      )
    })

    it('should use default intent of RELATED', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { productRecommendations: null } }),
      })

      await getProductRecommendations('gid://shopify/Product/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"intent":"RELATED"'),
        }),
      )
    })

    it('should compute pricing for each recommended product', async () => {
      const mockRecommendations = {
        data: {
          productRecommendations: [
            {
              id: 'gid://shopify/Product/2',
              title: 'Discounted Recommendation',
              handle: 'discounted-recommendation',
              availableForSale: true,
              priceRange: {
                minVariantPrice: { amount: '24.99', currencyCode: 'USD' },
              },
              compareAtPriceRange: {
                minVariantPrice: { amount: '34.99', currencyCode: 'USD' },
              },
              featuredImage: null,
            },
          ],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations),
      })

      const result = await getProductRecommendations('gid://shopify/Product/1')

      expect(result[0].price).toEqual({ amount: '24.99', currencyCode: 'USD' })
      expect(result[0].compareAtPrice).toEqual({
        amount: '34.99',
        currencyCode: 'USD',
      })
      expect(result[0].hasDiscount).toBe(true)
    })
  })
})
