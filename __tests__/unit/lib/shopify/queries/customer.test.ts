import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getCustomer } from '@/lib/shopify/queries/customer'

const mockFetch = vi.fn()

const mockCustomerResponse = {
  id: 'gid://shopify/Customer/123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  phone: '+1234567890',
  acceptsMarketing: true,
  defaultAddress: {
    id: 'gid://shopify/CustomerAddress/1',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company',
    address1: '123 Main St',
    address2: 'Apt 4',
    city: 'New York',
    province: 'New York',
    provinceCode: 'NY',
    country: 'United States',
    countryCodeV2: 'US',
    zip: '10001',
    phone: '+1234567890',
  },
  addresses: {
    edges: [
      {
        node: {
          id: 'gid://shopify/CustomerAddress/1',
          firstName: 'John',
          lastName: 'Doe',
          company: 'Test Company',
          address1: '123 Main St',
          address2: 'Apt 4',
          city: 'New York',
          province: 'New York',
          provinceCode: 'NY',
          country: 'United States',
          countryCodeV2: 'US',
          zip: '10001',
          phone: '+1234567890',
        },
        cursor: 'cursor1',
      },
      {
        node: {
          id: 'gid://shopify/CustomerAddress/2',
          firstName: 'John',
          lastName: 'Doe',
          company: null,
          address1: '456 Oak Ave',
          address2: null,
          city: 'Los Angeles',
          province: 'California',
          provinceCode: 'CA',
          country: 'United States',
          countryCodeV2: 'US',
          zip: '90001',
          phone: null,
        },
        cursor: 'cursor2',
      },
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'cursor1',
      endCursor: 'cursor2',
    },
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
}

describe('Customer Query', () => {
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

  describe('getCustomer', () => {
    it('should fetch customer by access token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('gid://shopify/Customer/123')
      expect(result?.email).toBe('test@example.com')
      expect(result?.firstName).toBe('John')
      expect(result?.lastName).toBe('Doe')
    })

    it('should return null when customer not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: null },
          }),
      })

      const result = await getCustomer('invalid-token')

      expect(result).toBeNull()
    })

    it('should return null for expired access token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: null },
          }),
      })

      const result = await getCustomer('expired-token')

      expect(result).toBeNull()
    })

    it('should pass access token variable to query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      await getCustomer('my-access-token-456')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            '"customerAccessToken":"my-access-token-456"',
          ),
        }),
      )
    })

    it('should transform addresses from edges to array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.addresses).toBeInstanceOf(Array)
      expect(result?.addresses).toHaveLength(2)
      expect(result?.addresses[0].id).toBe('gid://shopify/CustomerAddress/1')
      expect(result?.addresses[1].id).toBe('gid://shopify/CustomerAddress/2')
    })

    it('should include default address', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.defaultAddress).not.toBeNull()
      expect(result?.defaultAddress?.id).toBe('gid://shopify/CustomerAddress/1')
      expect(result?.defaultAddress?.city).toBe('New York')
    })

    it('should handle customer without default address', async () => {
      const customerWithoutDefault = {
        ...mockCustomerResponse,
        defaultAddress: null,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: customerWithoutDefault },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.defaultAddress).toBeNull()
    })

    it('should handle customer without addresses', async () => {
      const customerWithoutAddresses = {
        ...mockCustomerResponse,
        defaultAddress: null,
        addresses: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: customerWithoutAddresses },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.addresses).toEqual([])
    })

    it('should include marketing preferences', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.acceptsMarketing).toBe(true)
    })

    it('should include timestamps', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.createdAt).toBe('2024-01-01T00:00:00Z')
      expect(result?.updatedAt).toBe('2024-01-15T00:00:00Z')
    })

    it('should include display name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { customer: mockCustomerResponse },
          }),
      })

      const result = await getCustomer('test-access-token')

      expect(result?.displayName).toBe('John Doe')
    })
  })
})
