'use client'

import { CaretDownIcon, ListIcon, SquaresFourIcon } from '@phosphor-icons/react'

import type { OrdersView } from '@/lib/preferences/orders-view'
import { __ } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type OrdersViewMenuProps = {
  value: OrdersView
  onChange: (next: OrdersView) => void
}

const VIEW_OPTIONS: ReadonlyArray<{
  value: OrdersView
  label: () => string
  Icon: typeof SquaresFourIcon
}> = [
  {
    value: 'gallery',
    label: () => __('orders.view_gallery'),
    Icon: SquaresFourIcon,
  },
  { value: 'list', label: () => __('orders.view_list'), Icon: ListIcon },
]

export function OrdersViewMenu({ value, onChange }: OrdersViewMenuProps) {
  const current = VIEW_OPTIONS.find((option) => option.value === value)!
  const CurrentIcon = current.Icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" aria-label={__('orders.view_selector_label')}>
            <CurrentIcon data-icon="inline-start" />
            {current.label()}
            <CaretDownIcon data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as OrdersView)}
        >
          {VIEW_OPTIONS.map(({ value: optionValue, label, Icon }) => (
            <DropdownMenuRadioItem
              key={optionValue}
              value={optionValue}
              closeOnClick
            >
              <Icon />
              {label()}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
