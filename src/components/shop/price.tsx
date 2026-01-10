import { Money } from '@/lib/shopify/types'

type PriceProps = React.ComponentProps<'p'> & Money

export function Price({ amount, currencyCode, ...props }: PriceProps) {
  const locale = process.env.APP_LOCALE || 'en-US'

  return (
    <p {...props}>
      {new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(parseFloat(amount))}
    </p>
  )
}
