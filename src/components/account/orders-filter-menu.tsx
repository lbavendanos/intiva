'use client'

import { useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  CaretDownIcon,
  CheckIcon,
  FunnelIcon,
  XIcon,
} from '@phosphor-icons/react'

import {
  isIsoDate,
  type OrdersFilter,
  type OrdersInterval,
} from '@/lib/orders/filter'
import { __ } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type OrdersFilterMenuProps = {
  value: OrdersFilter | null
}

const PRESET_INTERVALS: ReadonlyArray<{
  value: Exclude<OrdersInterval, 'custom'>
  label: () => string
}> = [
  { value: 'today', label: () => __('orders.filter.today') },
  { value: 'last_7_days', label: () => __('orders.filter.last_7_days') },
  { value: 'last_30_days', label: () => __('orders.filter.last_30_days') },
  { value: 'last_90_days', label: () => __('orders.filter.last_90_days') },
  {
    value: 'last_12_months',
    label: () => __('orders.filter.last_12_months'),
  },
]

export function OrdersFilterMenu({ value }: OrdersFilterMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [customOpen, setCustomOpen] = useState(false)

  const activeInterval = value?.interval ?? null
  const activeLabel = describeFilter(value)

  const navigate = (next: OrdersFilter | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('cursor')
    params.delete('interval')
    params.delete('from')
    params.delete('to')

    if (next?.interval === 'custom') {
      params.set('interval', 'custom')
      params.set('from', next.from)
      params.set('to', next.to)
    } else if (next) {
      params.set('interval', next.interval)
    }

    const query = params.toString()
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname)
    })
  }

  const handleCustomApply = (from: string, to: string) => {
    setCustomOpen(false)
    navigate({ interval: 'custom', from, to })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              aria-label={__('orders.filter_selector_label')}
            >
              <FunnelIcon data-icon="inline-start" />
              {activeLabel}
              <CaretDownIcon data-icon="inline-end" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-38">
          {PRESET_INTERVALS.map(({ value: optionValue, label }) => (
            <DropdownMenuItem
              key={optionValue}
              closeOnClick
              onClick={() => navigate({ interval: optionValue })}
              className="pr-8"
            >
              {label()}
              {activeInterval === optionValue ? (
                <CheckIcon className="absolute right-2" />
              ) : null}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            closeOnClick
            onClick={() => setCustomOpen(true)}
            className="pr-8"
          >
            {__('orders.filter.custom')}
            {activeInterval === 'custom' ? (
              <CheckIcon className="absolute right-2" />
            ) : null}
          </DropdownMenuItem>
          {value !== null ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem closeOnClick onClick={() => navigate(null)}>
                <XIcon />
                {__('orders.filter_clear')}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomRangeDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        initialFrom={value?.interval === 'custom' ? value.from : ''}
        initialTo={value?.interval === 'custom' ? value.to : ''}
        onApply={handleCustomApply}
      />
    </>
  )
}

function describeFilter(filter: OrdersFilter | null): string {
  if (!filter) return __('orders.filter_label')
  switch (filter.interval) {
    case 'today':
      return __('orders.filter.today')
    case 'last_7_days':
      return __('orders.filter.last_7_days')
    case 'last_30_days':
      return __('orders.filter.last_30_days')
    case 'last_90_days':
      return __('orders.filter.last_90_days')
    case 'last_12_months':
      return __('orders.filter.last_12_months')
    case 'custom':
      return __('orders.filter_custom_range', {
        from: filter.from,
        to: filter.to,
      })
  }
}

type CustomRangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialFrom: string
  initialTo: string
  onApply: (from: string, to: string) => void
}

function CustomRangeDialog({
  open,
  onOpenChange,
  initialFrom,
  initialTo,
  onApply,
}: CustomRangeDialogProps) {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)

  const validFrom = isIsoDate(from)
  const validTo = isIsoDate(to)
  const rangeValid = validFrom && validTo && from <= to
  const showRangeError = validFrom && validTo && from > to

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!rangeValid) return
    onApply(from, to)
  }

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setFrom(initialFrom)
      setTo(initialTo)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{__('orders.filter_custom_title')}</DialogTitle>
          <DialogDescription>
            {__('orders.filter_custom_description')}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="orders-filter-from">
                {__('orders.filter_from')}
              </Label>
              <Input
                id="orders-filter-from"
                type="date"
                value={from}
                max={validTo ? to : undefined}
                onChange={(event) => setFrom(event.currentTarget.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="orders-filter-to">{__('orders.filter_to')}</Label>
              <Input
                id="orders-filter-to"
                type="date"
                value={to}
                min={validFrom ? from : undefined}
                onChange={(event) => setTo(event.currentTarget.value)}
                required
              />
            </div>
          </div>
          {showRangeError ? (
            <p className="text-destructive text-xs">
              {__('orders.filter_range_invalid')}
            </p>
          ) : null}
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {__('orders.filter_cancel')}
            </Button>
            <Button type="submit" disabled={!rangeValid}>
              {__('orders.filter_apply')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
