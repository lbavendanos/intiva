'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { ProductListItem } from '@/lib/shopify/storefront/types'
import { __ } from '@/lib/utils'
import { Price } from '@/components/common/price'
import { ProductCardColorSwatches } from '@/components/shop/product-card-color-swatches'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type ProductCardProps = {
  product: ProductListItem
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedHandle, setSelectedHandle] = useState(product.handle)

  const selectedSibling = product.colorSiblings.find(
    (sibling) => sibling.handle === selectedHandle,
  )
  const featuredImage = selectedSibling?.featuredImage ?? product.featuredImage
  const availableForSale =
    selectedSibling?.availableForSale ?? product.availableForSale
  const linkTitle = selectedSibling?.title ?? product.title
  const linkHref = `/products/${selectedHandle}`

  return (
    <article className="group relative" data-testid="product-card">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-zinc-100">
            {featuredImage ? (
              <Image
                src={featuredImage.url}
                alt={featuredImage.altText || linkTitle}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-zinc-400">{__('product.no_image')}</span>
              </div>
            )}
            {!availableForSale && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 z-10 bg-zinc-900 text-white"
              >
                {__('product.sold_out')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 group-hover:text-zinc-600">
            {product.displayTitle}
          </h3>
          {product.colorSiblings.length > 1 && selectedSibling && (
            <p className="mt-0.5 text-xs text-zinc-500">
              {selectedSibling.color.name}
            </p>
          )}
          <ProductCardColorSwatches
            siblings={product.colorSiblings}
            selectedHandle={selectedHandle}
            onSelect={setSelectedHandle}
            className="relative z-10 mt-2"
          />
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Price as="p" {...product.price} />
            {product.compareAtPrice && (
              <Price
                as="p"
                className="text-xl font-semibold line-through opacity-40"
                {...product.compareAtPrice}
              />
            )}
          </div>
        </CardFooter>
      </Card>
      <Link
        href={linkHref}
        aria-label={linkTitle}
        className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-6 w-20" />
      </CardFooter>
    </Card>
  )
}
