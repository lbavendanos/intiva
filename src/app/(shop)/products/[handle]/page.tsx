import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProducts } from '@/lib/shopify/queries'
import { __, url } from '@/lib/utils'
import { Price } from '@/components/shop/price'
import { ProductForm } from '@/components/shop/product-form'
import { ProductGallery } from '@/components/shop/product-gallery'
import { ProductJsonLd } from '@/components/shop/product-json-ld'
import { RelatedProducts } from '@/components/shop/related-products'
import { Separator } from '@/components/ui/separator'
import { getProductByHandle } from '@/actions/products'

type ProductPageProps = {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  const { products } = await getProducts(100)

  return products.map((product) => ({
    handle: product.handle,
  }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    return {
      title: __('product.not_found'),
    }
  }

  const title = product.seo.title || product.title
  const description =
    product.seo.description || product.description.slice(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: url(`/products/${handle}`),
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width || 1200,
              height: product.featuredImage.height || 630,
              alt: product.featuredImage.altText || product.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductJsonLd product={product} />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} productTitle={product.title} />
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-zinc-900">{product.title}</h1>
          {product.vendor && (
            <p className="mt-1 text-sm text-zinc-500">{product.vendor}</p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <Price className="text-2xl font-semibold" {...product.price} />
            {product.hasDiscount && (
              <Price
                className="text-2xl font-semibold line-through opacity-40"
                {...product.compareAtPrice}
              />
            )}
          </div>
          <Separator className="my-6" />
          <ProductForm product={product} />
          {product.descriptionHtml && (
            <>
              <Separator className="my-6" />
              <div className="prose prose-zinc max-w-none">
                <h2 className="text-lg font-semibold text-zinc-900">
                  {__('product.description')}
                </h2>
                <div
                  className="mt-2 text-sm text-zinc-600"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <RelatedProducts productId={product.id} />
    </div>
  )
}
