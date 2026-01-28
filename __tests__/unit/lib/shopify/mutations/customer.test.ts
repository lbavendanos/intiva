import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
  recoverCustomer,
} from '@/lib/shopify/mutations/customer'

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
    company: null,
    address1: '123 Main St',
    address2: null,
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
          company: null,
          address1: '123 Main St',
          address2: null,
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
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'cursor1',
      endCursor: 'cursor1',
    },
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockAccessToken = {
  accessToken: 'test-access-token-123',
  expiresAt: '2024-02-01T00:00:00Z',
}

describe('Customer Mutations', () => {
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

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerCreate: {
                customer: mockCustomerResponse,
                customerUserErrors: [],
              },
            },
          }),
      })

      const result = await createCustomer({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      })

      expect(result.customer).not.toBeNull()
      expect(result.customer?.id).toBe('gid://shopify/Customer/123')
      expect(result.customer?.email).toBe('test@example.com')
      expect(result.customerUserErrors).toEqual([])
    })

    it('should transform addresses from edges to array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerCreate: {
                customer: mockCustomerResponse,
                customerUserErrors: [],
              },
            },
          }),
      })

      const result = await createCustomer({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.customer?.addresses).toBeInstanceOf(Array)
      expect(result.customer?.addresses).toHaveLength(1)
      expect(result.customer?.addresses[0].id).toBe(
        'gid://shopify/CustomerAddress/1',
      )
    })

    it('should return user errors when email is already taken', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerCreate: {
                customer: null,
                customerUserErrors: [
                  {
                    field: ['email'],
                    message: 'Email has already been taken',
                    code: 'TAKEN',
                  },
                ],
              },
            },
          }),
      })

      const result = await createCustomer({
        email: 'existing@example.com',
        password: 'password123',
      })

      expect(result.customer).toBeNull()
      expect(result.customerUserErrors).toHaveLength(1)
      expect(result.customerUserErrors[0].code).toBe('TAKEN')
      expect(result.customerUserErrors[0].message).toBe(
        'Email has already been taken',
      )
    })

    it('should return user errors for invalid password', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerCreate: {
                customer: null,
                customerUserErrors: [
                  {
                    field: ['password'],
                    message: 'Password is too short (minimum is 5 characters)',
                    code: 'TOO_SHORT',
                  },
                ],
              },
            },
          }),
      })

      const result = await createCustomer({
        email: 'test@example.com',
        password: '123',
      })

      expect(result.customer).toBeNull()
      expect(result.customerUserErrors).toHaveLength(1)
      expect(result.customerUserErrors[0].code).toBe('TOO_SHORT')
    })

    it('should pass input variables to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerCreate: {
                customer: mockCustomerResponse,
                customerUserErrors: [],
              },
            },
          }),
      })

      await createCustomer({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        acceptsMarketing: true,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"email":"test@example.com"'),
        }),
      )
    })
  })

  describe('createCustomerAccessToken', () => {
    it('should create an access token with valid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenCreate: {
                customerAccessToken: mockAccessToken,
                customerUserErrors: [],
              },
            },
          }),
      })

      const result = await createCustomerAccessToken({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.customerAccessToken).not.toBeNull()
      expect(result.customerAccessToken?.accessToken).toBe(
        'test-access-token-123',
      )
      expect(result.customerUserErrors).toEqual([])
    })

    it('should return user errors for invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenCreate: {
                customerAccessToken: null,
                customerUserErrors: [
                  {
                    field: ['input'],
                    message: 'Unidentified customer',
                    code: 'UNIDENTIFIED_CUSTOMER',
                  },
                ],
              },
            },
          }),
      })

      const result = await createCustomerAccessToken({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })

      expect(result.customerAccessToken).toBeNull()
      expect(result.customerUserErrors).toHaveLength(1)
      expect(result.customerUserErrors[0].code).toBe('UNIDENTIFIED_CUSTOMER')
    })

    it('should pass credentials to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenCreate: {
                customerAccessToken: mockAccessToken,
                customerUserErrors: [],
              },
            },
          }),
      })

      await createCustomerAccessToken({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"email":"test@example.com"'),
        }),
      )
    })

    it('should include expiresAt in the response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenCreate: {
                customerAccessToken: mockAccessToken,
                customerUserErrors: [],
              },
            },
          }),
      })

      const result = await createCustomerAccessToken({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.customerAccessToken?.expiresAt).toBe('2024-02-01T00:00:00Z')
    })
  })

  describe('deleteCustomerAccessToken', () => {
    it('should delete an access token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenDelete: {
                deletedAccessToken: 'test-access-token-123',
                deletedCustomerAccessTokenId: 'gid://shopify/AccessToken/123',
                userErrors: [],
              },
            },
          }),
      })

      const result = await deleteCustomerAccessToken('test-access-token-123')

      expect(result.deletedAccessToken).toBe('test-access-token-123')
      expect(result.userErrors).toEqual([])
    })

    it('should return user errors for invalid token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenDelete: {
                deletedAccessToken: null,
                deletedCustomerAccessTokenId: null,
                userErrors: [
                  {
                    field: ['customerAccessToken'],
                    message: 'Invalid access token',
                  },
                ],
              },
            },
          }),
      })

      const result = await deleteCustomerAccessToken('invalid-token')

      expect(result.deletedAccessToken).toBeNull()
      expect(result.userErrors).toHaveLength(1)
      expect(result.userErrors[0].message).toBe('Invalid access token')
    })

    it('should pass token to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerAccessTokenDelete: {
                deletedAccessToken: 'test-access-token-123',
                deletedCustomerAccessTokenId: 'gid://shopify/AccessToken/123',
                userErrors: [],
              },
            },
          }),
      })

      await deleteCustomerAccessToken('test-access-token-123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(
            '"customerAccessToken":"test-access-token-123"',
          ),
        }),
      )
    })
  })

  describe('recoverCustomer', () => {
    it('should send recovery email successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerRecover: {
                customerUserErrors: [],
              },
            },
          }),
      })

      const result = await recoverCustomer('test@example.com')

      expect(result.customerUserErrors).toEqual([])
    })

    it('should return user errors for non-existent email', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerRecover: {
                customerUserErrors: [
                  {
                    field: ['email'],
                    message: 'Unidentified customer',
                    code: 'UNIDENTIFIED_CUSTOMER',
                  },
                ],
              },
            },
          }),
      })

      const result = await recoverCustomer('nonexistent@example.com')

      expect(result.customerUserErrors).toHaveLength(1)
      expect(result.customerUserErrors[0].code).toBe('UNIDENTIFIED_CUSTOMER')
    })

    it('should pass email to mutation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerRecover: {
                customerUserErrors: [],
              },
            },
          }),
      })

      await recoverCustomer('test@example.com')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"email":"test@example.com"'),
        }),
      )
    })

    it('should return user errors for invalid email format', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              customerRecover: {
                customerUserErrors: [
                  {
                    field: ['email'],
                    message: 'Email is invalid',
                    code: 'INVALID',
                  },
                ],
              },
            },
          }),
      })

      const result = await recoverCustomer('invalid-email')

      expect(result.customerUserErrors).toHaveLength(1)
      expect(result.customerUserErrors[0].code).toBe('INVALID')
    })
  })
})
