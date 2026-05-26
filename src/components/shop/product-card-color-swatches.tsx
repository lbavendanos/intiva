'use client'

import type { ProductColorSibling } from '@/lib/shopify/storefront/types'
import { __, cn } from '@/lib/utils'

type ProductCardColorSwatchesProps = {
  siblings: ProductColorSibling[]
  selectedHandle: string
  onSelect: (handle: string) => void
  className?: string
}

const MAX_VISIBLE_SWATCHES = 5

export function ProductCardColorSwatches({
  siblings,
  selectedHandle,
  onSelect,
  className,
}: ProductCardColorSwatchesProps) {
  if (siblings.length < 2) return null

  const visible = siblings.slice(0, MAX_VISIBLE_SWATCHES)
  const overflow = siblings.length - visible.length

  return (
    <ul
      role="radiogroup"
      aria-label={__('product.available_colors')}
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      {visible.map((sibling) => {
        const isSelected = sibling.handle === selectedHandle
        const isUnavailable = !sibling.availableForSale
        const label = isUnavailable
          ? `${sibling.color.name} — ${__('product.sold_out')}`
          : sibling.color.name

        return (
          <li key={sibling.handle}>
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              title={label}
              onClick={() => onSelect(sibling.handle)}
              className={cn(
                'relative inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full ring-offset-1 transition-shadow focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none',
                isSelected
                  ? 'ring-2 ring-zinc-900'
                  : 'ring-1 ring-zinc-200 hover:ring-zinc-400',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'block h-4 w-4 rounded-full border border-black/10',
                  isUnavailable && 'opacity-60',
                )}
                style={{ backgroundColor: sibling.color.hex }}
              />
              {isUnavailable && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0.5 overflow-hidden rounded-full"
                >
                  <span
                    className="absolute inset-0 block"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, transparent calc(50% - 1px), #fff calc(50% - 1px), #fff calc(50% + 1px), transparent calc(50% + 1px))',
                      mixBlendMode: 'difference',
                    }}
                  />
                </span>
              )}
            </button>
          </li>
        )
      })}
      {overflow > 0 && (
        <li
          aria-label={__('product.more_colors', { count: overflow })}
          title={__('product.more_colors', { count: overflow })}
          className="text-xs font-medium text-zinc-500"
        >
          +{overflow}
        </li>
      )}
    </ul>
  )
}
