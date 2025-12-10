'use client'

import { useState } from 'react'
import Image from 'next/image'

import type { Image as ShopifyImage } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: ShopifyImage[]
  productTitle: string
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-zinc-100">
        <div className="flex h-full items-center justify-center">
          <span className="text-zinc-400">Sin imagen</span>
        </div>
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || productTitle}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          role="listbox"
          aria-label="Galería de imágenes del producto"
        >
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors',
                selectedIndex === index
                  ? 'border-zinc-900'
                  : 'border-transparent hover:border-zinc-300',
              )}
              role="option"
              aria-selected={selectedIndex === index}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} - Imagen ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
