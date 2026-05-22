'use client'

import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react'

import type { ProductListItem } from '@/lib/shopify/storefront/types'
import { __ } from '@/lib/utils'
import { Price } from '@/components/common/price'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'

type SearchResponse =
  | { status: 'success'; products: ProductListItem[] }
  | { status: 'error' }

/** The resolved response paired with the query that produced it. */
type SearchState = {
  query: string
  response: SearchResponse
}

const SEARCH_DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

async function fetchSearchProducts(
  query: string,
  signal: AbortSignal,
): Promise<ProductListItem[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    signal,
  })

  if (!res.ok) {
    throw new Error('Search request failed')
  }

  const data = (await res.json()) as { products: ProductListItem[] }

  return data.products
}

function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

function SearchResultItem({
  product,
  onSelect,
}: {
  product: ProductListItem
  onSelect: () => void
}) {
  const {
    title,
    handle,
    featuredImage,
    availableForSale,
    price,
    compareAtPrice,
    hasDiscount,
  } = product

  return (
    <Link
      href={`/products/${handle}`}
      onClick={onSelect}
      className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
      data-testid="search-result"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-zinc-100">
        {featuredImage && (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            fill
            sizes="48px"
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">{title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <Price
            as="span"
            className="text-sm font-semibold text-zinc-900"
            {...price}
          />
          {hasDiscount && (
            <Price
              as="span"
              className="text-xs text-zinc-400 line-through"
              {...compareAtPrice}
            />
          )}
        </div>
      </div>
      {!availableForSale && (
        <Badge variant="secondary" className="shrink-0 bg-zinc-900 text-white">
          {__('product.sold_out')}
        </Badge>
      )}
    </Link>
  )
}

export function SearchDialog() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [state, setState] = useState<SearchState | null>(null)

  const trimmedQuery = query.trim()
  const isQueryValid = trimmedQuery.length >= MIN_QUERY_LENGTH

  // The response only applies while it matches the current query; otherwise
  // the results are stale and a fresh request is still in flight.
  const response = state && state.query === trimmedQuery ? state.response : null
  const isLoading = isQueryValid && response === null
  const searchHref = `/search?q=${encodeURIComponent(trimmedQuery)}`

  const cancelPendingSearch = () => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    abortRef.current?.abort()
    abortRef.current = null
  }

  // Searching is driven by the typing event, so the fetch lives in the change
  // handler rather than an effect. The debounce timer and abort controller are
  // kept in refs because they outlive a single keystroke.
  const handleQueryChange = (value: string) => {
    setQuery(value)
    cancelPendingSearch()

    const trimmed = value.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) {
      return
    }

    const controller = new AbortController()
    abortRef.current = controller

    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null

      fetchSearchProducts(trimmed, controller.signal)
        .then((products) => {
          setState({
            query: trimmed,
            response: { status: 'success', products },
          })
        })
        .catch(() => {
          if (controller.signal.aborted) return
          setState({ query: trimmed, response: { status: 'error' } })
        })
    }, SEARCH_DEBOUNCE_MS)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      cancelPendingSearch()
      setQuery('')
      setState(null)
    }
  }

  // Pressing Enter navigates to the full search page, which lists every
  // matching product instead of the limited preview shown in this dialog.
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isQueryValid) {
      return
    }

    router.push(searchHref)
    handleOpenChange(false)
  }

  // Lifecycle cleanup only: drop a pending debounce or in-flight request if the
  // component unmounts mid-search. This is the legitimate use of an effect.
  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current)
      }

      abortRef.current?.abort()
    }
  }, [])

  const renderContent = () => {
    if (!isQueryValid) {
      return (
        <p className="text-muted-foreground px-2 py-8 text-center text-sm">
          {__('search.prompt')}
        </p>
      )
    }

    if (isLoading) {
      return (
        <div aria-label={__('search.searching')} role="status">
          {Array.from({ length: 4 }).map((_, index) => (
            <SearchResultSkeleton key={index} />
          ))}
        </div>
      )
    }

    if (response?.status === 'error') {
      return (
        <p className="text-muted-foreground px-2 py-8 text-center text-sm">
          {__('search.error')}
        </p>
      )
    }

    if (response?.status === 'success' && response.products.length === 0) {
      return (
        <p className="text-muted-foreground px-2 py-8 text-center text-sm">
          {__('search.empty', { query: trimmedQuery })}
        </p>
      )
    }

    if (response?.status === 'success') {
      return (
        <ul className="flex flex-col">
          {response.products.map((product) => (
            <li key={product.id}>
              <SearchResultItem
                product={product}
                onSelect={() => handleOpenChange(false)}
              />
            </li>
          ))}
        </ul>
      )
    }

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={__('search.label')}
            data-testid="search-button"
          >
            <MagnifyingGlassIcon className="size-5" />
          </Button>
        }
      />
      <DialogContent
        showCloseButton={false}
        initialFocus={inputRef}
        className="top-[8vh] flex max-h-[80vh] translate-y-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{__('search.title')}</DialogTitle>
        <DialogDescription className="sr-only">
          {__('search.description')}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="border-border border-b p-3">
          <InputGroup>
            <InputGroupAddon>
              {isLoading ? (
                <SpinnerGapIcon className="animate-spin" />
              ) : (
                <MagnifyingGlassIcon />
              )}
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              type="search"
              autoComplete="off"
              placeholder={__('search.placeholder')}
              aria-label={__('search.label')}
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
            />
          </InputGroup>
        </form>

        <div
          className="min-h-0 flex-1 overflow-y-auto p-2"
          aria-live="polite"
          data-testid="search-results"
        >
          {renderContent()}
        </div>

        {response?.status === 'success' && response.products.length > 0 && (
          <div className="border-border border-t p-2">
            <Link
              href={searchHref}
              onClick={() => handleOpenChange(false)}
              className="hover:bg-muted flex items-center justify-center gap-2 rounded-md p-2 text-sm font-medium text-zinc-900 transition-colors"
              data-testid="search-view-all"
            >
              {__('search.view_all')}
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
