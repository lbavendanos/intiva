import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProductByHandle, getProducts } from '@/lib/shopify/queries'
import { url } from '@/lib/utils'
import { ProductDetail } from '@/components/shop/product-detail'

interface ProductPageProps {
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
      title: 'Producto no encontrado',
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
      type: 'website',
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
      <ProductDetail product={product} />
    </div>
  )
}
