import Image from 'next/image'
import Link from 'next/link'

import type { CollectionCardData } from '@/lib/shopify/queries'
import { __ } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface CollectionCardProps {
  collection: CollectionCardData
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { title, handle, description, image } = collection

  return (
    <Link
      href={`/collections/${handle}`}
      className="group"
      data-testid="collection-card"
    >
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-zinc-400">
                  {__('collection.no_image')}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-600">
            {title}
          </h3>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
