import { formatMoney } from '@/lib/shopify/client'
import type { Money } from '@/lib/shopify/types'

interface PriceDisplayProps {
  price: Money
  compareAtPrice?: Money | null
  className?: string
}

export function PriceDisplay({
  price,
  compareAtPrice,
  className,
}: PriceDisplayProps) {
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-zinc-900">
          {formatMoney(price)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-zinc-500 line-through">
            {formatMoney(compareAtPrice)}
          </span>
        )}
      </div>
      {hasDiscount && (
        <span className="mt-1 inline-block rounded bg-red-100 px-2 py-0.5 text-sm font-medium text-red-800">
          {Math.round(
            ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
              parseFloat(compareAtPrice.amount)) *
              100,
          )}
          % de descuento
        </span>
      )}
    </div>
  )
}
