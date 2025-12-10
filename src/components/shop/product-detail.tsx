'use client'

import type { Product } from '@/lib/shopify/types'
import { useVariantSelector } from '@/hooks/use-variant-selector'
import { Separator } from '@/components/ui/separator'

import { AddToCartButton } from './add-to-cart-button'
import { PriceDisplay } from './price-display'
import { ProductGallery } from './product-gallery'
import { VariantSelector } from './variant-selector'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { selectedOptions, selectedVariant, updateOption, isOptionAvailable } =
    useVariantSelector({
      options: product.options,
      variants: product.variants,
    })

  const displayPrice =
    selectedVariant?.price || product.priceRange.minVariantPrice
  const displayCompareAtPrice = selectedVariant?.compareAtPrice || null
  const isAvailable =
    selectedVariant?.availableForSale ?? product.availableForSale

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images} productTitle={product.title} />

      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-zinc-900">{product.title}</h1>

        {product.vendor && (
          <p className="mt-1 text-sm text-zinc-500">{product.vendor}</p>
        )}

        <div className="mt-4">
          <PriceDisplay
            price={displayPrice}
            compareAtPrice={displayCompareAtPrice}
          />
        </div>

        {!isAvailable && (
          <p className="mt-2 text-sm font-medium text-red-600">
            Producto agotado
          </p>
        )}

        <Separator className="my-6" />

        {product.options.length > 0 &&
          !(
            product.options.length === 1 &&
            product.options[0].name === 'Title' &&
            product.options[0].values.length === 1
          ) && (
            <>
              <VariantSelector
                options={product.options}
                selectedOptions={selectedOptions}
                onOptionChange={updateOption}
                isOptionAvailable={isOptionAvailable}
              />
              <Separator className="my-6" />
            </>
          )}

        <AddToCartButton
          variantId={selectedVariant?.id || null}
          availableForSale={isAvailable}
        />

        {selectedVariant?.quantityAvailable !== null &&
          selectedVariant?.quantityAvailable !== undefined &&
          selectedVariant.quantityAvailable <= 5 &&
          selectedVariant.quantityAvailable > 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Solo quedan {selectedVariant.quantityAvailable} unidades
            </p>
          )}

        {product.descriptionHtml && (
          <>
            <Separator className="my-6" />
            <div className="prose prose-zinc max-w-none">
              <h2 className="text-lg font-semibold text-zinc-900">
                Descripción
              </h2>
              <div
                className="mt-2 text-sm text-zinc-600"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          </>
        )}

        {product.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-zinc-900">Etiquetas</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
