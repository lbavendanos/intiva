type DateTimeProps<T extends React.ElementType = 'time'> = {
  as?: T
  value: string
  includeTime?: boolean
} & Omit<React.ComponentProps<T>, 'children' | 'as'>

export function DateTime<T extends React.ElementType = 'time'>({
  as,
  value,
  includeTime = false,
  ...props
}: DateTimeProps<T>) {
  const Component = as ?? 'time'
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
  const date = new Date(value)
  const formatted = date.toLocaleDateString(appLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  })

  const timeProps = Component === 'time' ? { dateTime: value } : {}

  return (
    <Component {...timeProps} {...props}>
      {formatted}
    </Component>
  )
}
