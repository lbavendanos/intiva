import Link from 'next/link'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr'

import type { PageInfo } from '@/lib/shopify/types'
import { __, url } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

type PaginationProps = {
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
        <Link
          href={basePath}
          className={buttonVariants({ variant: 'outline' })}
        >
          <CaretLeftIcon data-icon="inline-start" />
          {__('pagination.previous')}
        </Link>
      ) : (
        <Button variant="outline" disabled>
          <CaretLeftIcon data-icon="inline-start" />
          {__('pagination.previous')}
        </Button>
      )}

      {hasNextPage ? (
        <Link
          href={createUrl(endCursor)}
          className={buttonVariants({ variant: 'outline' })}
        >
          {__('pagination.next')}
          <CaretRightIcon data-icon="inline-end" />
        </Link>
      ) : (
        <Button variant="outline" disabled>
          {__('pagination.next')}
          <CaretRightIcon data-icon="inline-end" />
        </Button>
      )}
    </nav>
  )
}
