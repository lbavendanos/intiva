import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { PageInfo } from '@/lib/shopify/types'
import { __, url } from '@/lib/utils'
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
      aria-label={__('pagination.aria_label')}
    >
      {hasPreviousPage ? (
        <Button variant="outline" asChild>
          <Link href={basePath}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {__('pagination.previous')}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {__('pagination.previous')}
        </Button>
      )}

      {hasNextPage ? (
        <Button variant="outline" asChild>
          <Link href={createUrl(endCursor)}>
            {__('pagination.next')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          {__('pagination.next')}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
