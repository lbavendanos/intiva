'use client'

import { useCallback, useMemo, useState } from 'react'

import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

interface UseVariantSelectorProps {
  options: ProductOption[]
  variants: ProductVariant[]
}

interface UseVariantSelectorReturn {
  selectedOptions: Record<string, string>
  selectedVariant: ProductVariant | null
  updateOption: (optionName: string, value: string) => void
  isOptionAvailable: (optionName: string, value: string) => boolean
}

export function useVariantSelector({
  options,
  variants,
}: UseVariantSelectorProps): UseVariantSelectorReturn {
  const initialOptions = useMemo(() => {
    const initial: Record<string, string> = {}

    for (const option of options) {
      if (option.values.length > 0) {
        initial[option.name] = option.values[0]
      }
    }

    return initial
  }, [options])

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions)

  const selectedVariant = useMemo(() => {
    return (
      variants.find((variant) =>
        variant.selectedOptions.every(
          (option) => selectedOptions[option.name] === option.value,
        ),
      ) ?? null
    )
  }, [variants, selectedOptions])

  const updateOption = useCallback((optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }))
  }, [])

  const isOptionAvailable = useCallback(
    (optionName: string, value: string) => {
      const testOptions = { ...selectedOptions, [optionName]: value }

      return variants.some(
        (variant) =>
          variant.availableForSale &&
          variant.selectedOptions.every(
            (option) => testOptions[option.name] === option.value,
          ),
      )
    },
    [selectedOptions, variants],
  )

  return {
    selectedOptions,
    selectedVariant,
    updateOption,
    isOptionAvailable,
  }
}
