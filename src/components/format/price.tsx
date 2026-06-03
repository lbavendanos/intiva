import type { Money } from '@/lib/shopify/types'

type PriceProps<T extends React.ElementType = 'span'> = {
  as?: T
  value: Money
  format?: Intl.NumberFormatOptions
} & Omit<React.ComponentProps<T>, 'children' | 'as' | 'value' | 'format'>

const DEFAULT_FORMAT: Intl.NumberFormatOptions = {
  style: 'currency',
}

export function Price<T extends React.ElementType = 'span'>({
  as,
  value,
  format = DEFAULT_FORMAT,
  ...props
}: PriceProps<T>) {
  const Component = as ?? 'span'
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
  const formatted = new Intl.NumberFormat(appLocale, {
    currency: value.currencyCode,
    ...format,
  }).format(parseFloat(value.amount))

  return <Component {...props}>{formatted}</Component>
}
