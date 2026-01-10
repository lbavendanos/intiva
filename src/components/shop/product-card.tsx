import Image from 'next/image'
import Link from 'next/link'

import type { ProductListItem } from '@/lib/shopify/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Price } from './price'

type ProductCardProps = {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    title,
    handle,
    availableForSale,
    featuredImage,
    price,
    compareAtPrice,
  } = product

  return (
    <Link
      href={`/products/${handle}`}
      className="group"
      data-testid="product-card"
    >
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-zinc-100">
            {featuredImage ? (
              <Image
                src={featuredImage.url}
                alt={featuredImage.altText || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-zinc-400">Sin imagen</span>
              </div>
            )}
            {!availableForSale && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 bg-zinc-900 text-white"
              >
                Agotado
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-600">
            {title}
          </h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Price {...price} />
            {product.hasDiscount && (
              <Price
                className="text-xl font-semibold line-through opacity-40"
                {...compareAtPrice}
              />
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
