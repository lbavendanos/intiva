import Link from 'next/link'

import type { ProductColorSibling } from '@/lib/shopify/storefront/types'
import { __, cn } from '@/lib/utils'

type ProductColorSwatchesProps = {
  siblings: ProductColorSibling[]
  currentHandle: string
  className?: string
}

export function ProductColorSwatches({
  siblings,
  currentHandle,
  className,
}: ProductColorSwatchesProps) {
  if (siblings.length < 2) return null

  const current = siblings.find((sibling) => sibling.handle === currentHandle)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-baseline gap-2 text-sm">
        <span className="font-medium text-zinc-900">{__('product.color')}</span>
        {current && <span className="text-zinc-500">{current.color.name}</span>}
      </div>
      <ul className="flex flex-wrap gap-3">
        {siblings.map((sibling) => {
          const isCurrent = sibling.handle === currentHandle
          const isUnavailable = !sibling.availableForSale
          const label = isUnavailable
            ? `${sibling.color.name} — ${__('product.sold_out')}`
            : sibling.color.name

          return (
            <li key={sibling.handle}>
              <Link
                href={`/products/${sibling.handle}`}
                aria-label={label}
                aria-current={isCurrent ? 'page' : undefined}
                title={label}
                className={cn(
                  'group relative inline-flex h-10 w-10 items-center justify-center rounded-full ring-offset-2 transition-shadow focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none',
                  isCurrent
                    ? 'ring-2 ring-zinc-900'
                    : 'ring-1 ring-zinc-200 hover:ring-zinc-400',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'block h-8 w-8 rounded-full border border-black/10',
                    isUnavailable && 'opacity-60',
                  )}
                  style={{ backgroundColor: sibling.color.hex }}
                />
                {isUnavailable && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-1 overflow-hidden rounded-full"
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
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
