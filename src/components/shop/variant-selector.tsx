'use client'

import type { ProductOption } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

interface VariantSelectorProps {
  options: ProductOption[]
  selectedOptions: Record<string, string>
  onOptionChange: (optionName: string, value: string) => void
  isOptionAvailable: (optionName: string, value: string) => boolean
}

export function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
  isOptionAvailable,
}: VariantSelectorProps) {
  if (options.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <div key={option.id}>
          <label className="mb-2 block text-sm font-medium text-zinc-900">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value
              const isAvailable = isOptionAvailable(option.name, value)

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-900',
                    !isAvailable &&
                      'cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300 line-through',
                  )}
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={!isAvailable}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
