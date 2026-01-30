import { Money } from '@/lib/shopify/types'

type PriceProps<T extends React.ElementType = 'p'> = {
  as?: T
} & Money &
  Omit<React.ComponentProps<T>, keyof Money | 'as'>

export function Price<T extends React.ElementType = 'p'>({
  as,
  amount,
  currencyCode,
  ...props
}: PriceProps<T>) {
  const Component = as ?? 'p'
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
