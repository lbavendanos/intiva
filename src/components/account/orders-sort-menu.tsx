'use client'

import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowsDownUpIcon, CaretDownIcon, XIcon } from '@phosphor-icons/react'

import { type OrdersSort } from '@/lib/orders/sort'
import { __ } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type OrdersSortMenuProps = {
  value: OrdersSort | null
}

const SORT_OPTIONS: ReadonlyArray<{
  value: OrdersSort
  label: () => string
}> = [
  { value: 'newest', label: () => __('orders.sort.newest') },
  { value: 'oldest', label: () => __('orders.sort.oldest') },
  {
    value: 'order_number_high',
    label: () => __('orders.sort.order_number_high'),
  },
  {
    value: 'order_number_low',
    label: () => __('orders.sort.order_number_low'),
  },
  { value: 'total_high', label: () => __('orders.sort.total_high') },
  { value: 'total_low', label: () => __('orders.sort.total_low') },
]

export function OrdersSortMenu({ value }: OrdersSortMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeLabel =
    SORT_OPTIONS.find((option) => option.value === value)?.label() ??
    __('orders.sort_label')

  const navigate = (next: OrdersSort | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('cursor')
    if (next) {
      params.set('sortBy', next)
    } else {
      params.delete('sortBy')
    }
    const query = params.toString()
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" aria-label={__('orders.sort_selector_label')}>
            <ArrowsDownUpIcon data-icon="inline-start" />
            {activeLabel}
            <CaretDownIcon data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-64">
        <DropdownMenuRadioGroup
          value={value ?? ''}
          onValueChange={(next) => navigate(next as OrdersSort)}
        >
          {SORT_OPTIONS.map(({ value: optionValue, label }) => (
            <DropdownMenuRadioItem
              key={optionValue}
              value={optionValue}
              closeOnClick
            >
              {label()}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {value !== null ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem closeOnClick onClick={() => navigate(null)}>
              <XIcon />
              {__('orders.sort_clear')}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
