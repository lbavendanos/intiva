import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'

import type { CartLineItem } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { Price } from '@/components/common/price'
import { Button } from '@/components/ui/button'

type CartItemProps = {
  item: CartLineItem
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
}

export function CartItem({ item, updateQuantity, removeItem }: CartItemProps) {
  const { id, quantity, merchandise, cost } = item
  const { product, selectedOptions } = merchandise

  const variantTitle = selectedOptions
    .filter((option) => option.value !== 'Default Title')
    .map((option) => option.value)
    .join(' / ')

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleRemove = () => {
    removeItem(id)
  }

  return (
    <div className="flex gap-4 py-4" data-testid="cart-item">
      <Link
        href={`/products/${product.handle}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100"
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-zinc-400">
              {__('cart.item.no_image')}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${product.handle}`}
              className="text-sm font-medium text-zinc-900 hover:text-zinc-600"
            >
              {product.title}
            </Link>
            {variantTitle && (
              <p className="mt-1 text-xs text-zinc-500">{variantTitle}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleRemove}
            aria-label={__('cart.item.remove', { name: product.title })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleUpdateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              aria-label={__('cart.item.decrease')}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleUpdateQuantity(quantity + 1)}
              aria-label={__('cart.item.increase')}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Price
            as="p"
            className="text-sm font-semibold"
            amount={cost.totalAmount.amount}
            currencyCode={cost.totalAmount.currencyCode}
          />
        </div>
      </div>
    </div>
  )
}
