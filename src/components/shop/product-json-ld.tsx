import type { Product as ProductContext, WithContext } from 'schema-dts'

import type { Product } from '@/lib/shopify/types'
import { url } from '@/lib/utils'

type ProductJsonLdProps = {
  product: Product
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME

  const name = product.seo.title || product.title
  const description =
    product.seo.description || product.description.slice(0, 160)

  const jsonLd: WithContext<ProductContext> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url: url(`/products/${product.handle}`).toString(),
    image: product.featuredImage?.url,
    brand: { '@type': 'Brand', name: appName },
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
