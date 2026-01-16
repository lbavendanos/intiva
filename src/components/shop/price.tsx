import { Money } from '@/lib/shopify/types'

type PriceProps = React.ComponentProps<'p'> & Money

export function Price({ amount, currencyCode, ...props }: PriceProps) {
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE

  return (
    <p {...props}>
      {new Intl.NumberFormat(appLocale, {
        style: 'currency',
        currency: currencyCode,
      }).format(parseFloat(amount))}
    </p>
  )
}
