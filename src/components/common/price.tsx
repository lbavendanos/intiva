import type { Money } from '@/lib/shopify/types'

type PriceProps<T extends React.ElementType = 'span'> = {
  as?: T
} & Money &
  Omit<React.ComponentProps<T>, keyof Money | 'as'>

export function Price<T extends React.ElementType = 'span'>({
  as,
  amount,
  currencyCode,
  ...props
}: PriceProps<T>) {
  const Component = as ?? 'span'
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE

  return (
    <Component {...props}>
      {new Intl.NumberFormat(appLocale, {
        style: 'currency',
        currency: currencyCode,
      }).format(parseFloat(amount))}
    </Component>
  )
}
