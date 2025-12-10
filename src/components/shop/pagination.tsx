import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { PageInfo } from '@/lib/shopify/types'
import { url } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  pageInfo: PageInfo
  basePath: string
}

export function Pagination({ pageInfo, basePath }: PaginationProps) {
  const { hasNextPage, hasPreviousPage, endCursor } = pageInfo

  if (!hasNextPage && !hasPreviousPage) {
    return null
  }

  const createUrl = (cursor?: string | null) => {
    const newUrl = url(basePath)

    if (cursor) {
      newUrl.searchParams.set('cursor', cursor)
    }

    return `${newUrl.pathname}${newUrl.search}`
  }

  return (
    <nav
      className="flex items-center justify-center gap-4 py-8"
      aria-label="Paginación"
    >
      {hasPreviousPage ? (
        <Button variant="outline" asChild>
          <Link href={basePath}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
      )}

      {hasNextPage ? (
        <Button variant="outline" asChild>
          <Link href={createUrl(endCursor)}>
            Siguiente
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
