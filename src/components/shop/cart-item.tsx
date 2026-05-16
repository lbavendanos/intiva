import Image from 'next/image'
import Link from 'next/link'
import { MinusIcon, PlusIcon, XIcon } from '@phosphor-icons/react/dist/ssr'

import type { CartLineItem } from '@/lib/shopify/storefront/types'
import { __ } from '@/lib/utils'
import { Price } from '@/components/common/price'
import { Button } from '@/components/ui/button'

type CartItemProps = {
  item: CartLineItem
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  onNavigate?: (href: string) => void
}

export function CartItem({
  item,
  updateQuantity,
  removeItem,
  onNavigate,
}: CartItemProps) {
  const { id, quantity, merchandise, cost } = item
  const { product, selectedOptions } = merchandise
  const href = `/products/${product.handle}`

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

  const handleNavigate = onNavigate
    ? (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return
        }

        event.preventDefault()
        onNavigate(href)
      }
    : undefined

  return (
    <div className="flex gap-4 py-4" data-testid="cart-item">
      <Link
        href={href}
        onClick={handleNavigate}
        className="relative size-20 shrink-0 overflow-hidden rounded-md bg-zinc-100"
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
              href={href}
              onClick={handleNavigate}
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
            size="icon-sm"
            onClick={handleRemove}
            aria-label={__('cart.item.remove', { name: product.title })}
          >
            <XIcon className="size-4" />
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              aria-label={__('cart.item.decrease')}
            >
              <MinusIcon />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdateQuantity(quantity + 1)}
              aria-label={__('cart.item.increase')}
            >
              <PlusIcon />
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
