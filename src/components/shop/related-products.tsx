import { getProductRecommendations } from '@/lib/shopify/queries'
import { __ } from '@/lib/utils'

import { ProductCard } from './product-card'

type RelatedProductsProps = {
  productId: string
}

export async function RelatedProducts({ productId }: RelatedProductsProps) {
  const products = await getProductRecommendations(productId, 'RELATED')

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900">
        {__('product.related')}
      </h2>
      <div className="flex gap-4 overflow-x-auto sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="w-50 shrink-0 sm:w-62.5">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
