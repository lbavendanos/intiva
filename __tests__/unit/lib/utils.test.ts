import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { url } from '@/lib/utils'

describe('url', () => {
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
  })

  it('should generate URL with default path', () => {
    const result = url()

    expect(result.href).toBe('https://example.com/')
  })

  it('should generate URL with specific path', () => {
    const result = url('/products')

    expect(result.href).toBe('https://example.com/products')
  })

  it('should generate URL with nested path', () => {
    const result = url('/collections/summer-2024')

    expect(result.href).toBe('https://example.com/collections/summer-2024')
  })

  it('should generate URL with query parameters', () => {
    const result = url('/products?page=2')

    expect(result.href).toBe('https://example.com/products?page=2')
  })

  it('should handle path without leading slash', () => {
    const result = url('products')

    expect(result.href).toBe('https://example.com/products')
  })

  it('should handle NEXT_PUBLIC_APP_URL with trailing slash', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com/'

    const result = url('/products')

    expect(result.href).toBe('https://example.com/products')
  })

  it('should throw error when NEXT_PUBLIC_APP_URL is not defined', () => {
    delete process.env.NEXT_PUBLIC_APP_URL

    expect(() => url()).toThrow(
      'NEXT_PUBLIC_APP_URL environment variable is not defined. Please set it in your .env file.',
    )
  })
})
