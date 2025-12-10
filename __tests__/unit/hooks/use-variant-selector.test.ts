import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { ProductOption, ProductVariant } from '@/lib/shopify/types'
import { useVariantSelector } from '@/hooks/use-variant-selector'

const mockOptions: ProductOption[] = [
  { id: 'opt1', name: 'Size', values: ['S', 'M', 'L'] },
  { id: 'opt2', name: 'Color', values: ['Red', 'Blue'] },
]

const mockVariants: ProductVariant[] = [
  {
    id: 'var1',
    title: 'S / Red',
    availableForSale: true,
    quantityAvailable: 10,
    selectedOptions: [
      { name: 'Size', value: 'S' },
      { name: 'Color', value: 'Red' },
    ],
    price: { amount: '29.99', currencyCode: 'USD' },
    compareAtPrice: null,
    image: null,
  },
  {
    id: 'var2',
    title: 'S / Blue',
    availableForSale: true,
    quantityAvailable: 5,
    selectedOptions: [
      { name: 'Size', value: 'S' },
      { name: 'Color', value: 'Blue' },
    ],
    price: { amount: '29.99', currencyCode: 'USD' },
    compareAtPrice: null,
    image: null,
  },
  {
    id: 'var3',
    title: 'M / Red',
    availableForSale: false,
    quantityAvailable: 0,
    selectedOptions: [
      { name: 'Size', value: 'M' },
      { name: 'Color', value: 'Red' },
    ],
    price: { amount: '29.99', currencyCode: 'USD' },
    compareAtPrice: null,
    image: null,
  },
  {
    id: 'var4',
    title: 'M / Blue',
    availableForSale: true,
    quantityAvailable: 3,
    selectedOptions: [
      { name: 'Size', value: 'M' },
      { name: 'Color', value: 'Blue' },
    ],
    price: { amount: '34.99', currencyCode: 'USD' },
    compareAtPrice: { amount: '39.99', currencyCode: 'USD' },
    image: null,
  },
]

describe('useVariantSelector', () => {
  it('should initialize with first option values', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: mockOptions, variants: mockVariants }),
    )

    expect(result.current.selectedOptions).toEqual({
      Size: 'S',
      Color: 'Red',
    })
  })

  it('should find selected variant based on options', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: mockOptions, variants: mockVariants }),
    )

    expect(result.current.selectedVariant?.id).toBe('var1')
    expect(result.current.selectedVariant?.title).toBe('S / Red')
  })

  it('should update option when updateOption is called', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: mockOptions, variants: mockVariants }),
    )

    act(() => {
      result.current.updateOption('Color', 'Blue')
    })

    expect(result.current.selectedOptions.Color).toBe('Blue')
    expect(result.current.selectedVariant?.id).toBe('var2')
  })

  it('should update selected variant when options change', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: mockOptions, variants: mockVariants }),
    )

    act(() => {
      result.current.updateOption('Size', 'M')
      result.current.updateOption('Color', 'Blue')
    })

    expect(result.current.selectedVariant?.id).toBe('var4')
    expect(result.current.selectedVariant?.price.amount).toBe('34.99')
  })

  it('should return null variant when combination does not exist', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: mockOptions, variants: mockVariants }),
    )

    act(() => {
      result.current.updateOption('Size', 'L')
    })

    expect(result.current.selectedVariant).toBeNull()
  })

  it('should correctly determine option availability', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: mockOptions, variants: mockVariants }),
    )

    // S / Red is available
    expect(result.current.isOptionAvailable('Size', 'S')).toBe(true)
    expect(result.current.isOptionAvailable('Color', 'Red')).toBe(true)

    // M / Red is not available (availableForSale: false)
    act(() => {
      result.current.updateOption('Size', 'M')
    })
    expect(result.current.isOptionAvailable('Color', 'Red')).toBe(false)
    expect(result.current.isOptionAvailable('Color', 'Blue')).toBe(true)
  })

  it('should handle empty options', () => {
    const { result } = renderHook(() =>
      useVariantSelector({ options: [], variants: [] }),
    )

    expect(result.current.selectedOptions).toEqual({})
    expect(result.current.selectedVariant).toBeNull()
  })

  it('should handle single option products', () => {
    const singleOption: ProductOption[] = [
      { id: 'opt1', name: 'Size', values: ['S', 'M'] },
    ]
    const singleVariants: ProductVariant[] = [
      {
        id: 'var1',
        title: 'S',
        availableForSale: true,
        quantityAvailable: 10,
        selectedOptions: [{ name: 'Size', value: 'S' }],
        price: { amount: '29.99', currencyCode: 'USD' },
        compareAtPrice: null,
        image: null,
      },
    ]

    const { result } = renderHook(() =>
      useVariantSelector({ options: singleOption, variants: singleVariants }),
    )

    expect(result.current.selectedOptions).toEqual({ Size: 'S' })
    expect(result.current.selectedVariant?.id).toBe('var1')
  })
})
